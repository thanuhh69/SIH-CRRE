import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const isCloudinaryActive = (): boolean => {
  return true;
};

/**
 * Uploads a file to Cloudinary.
 * First tries direct browser-to-Cloudinary signed upload (supporting files up to 100MB without serverless body limits).
 * Fallbacks to server route /api/upload.
 */
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
  // Method 1: Direct Signed Upload to Cloudinary REST API (Bypasses Vercel 4.5MB request body limit)
  try {
    const signRes = await fetch('/api/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folder,
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.success && signData.signature) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.api_key);
        formData.append('timestamp', signData.timestamp.toString());
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);
        formData.append('public_id', signData.public_id);

        const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${signData.resource_type}/upload`;
        const directRes = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (directRes.ok) {
          const directResult = await directRes.json();
          if (directResult.secure_url) {
            console.log('Direct Cloudinary signed upload successful:', directResult.secure_url);
            return directResult.secure_url;
          }
        } else {
          console.warn('Direct Cloudinary endpoint returned non-OK status, falling back to server route');
        }
      }
    }
  } catch (err) {
    console.warn('Direct Cloudinary signed upload attempt failed, trying /api/upload server route:', err);
  }

  // Method 2: Fallback to Server API route /api/upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Upload failed with status code ${response.status}`);
  }

  const data = await response.json();
  if (!data.success || !data.url) {
    throw new Error(data.error || 'Invalid response from Cloudinary upload API');
  }

  return data.url;
};

/**
 * Formats a Cloudinary file URL to trigger forced browser download for PPT / PDF / images
 * Strictly verifies http:// or https:// scheme to prevent local-file:// browser tabs.
 */
export const getCloudinaryDownloadUrl = (url?: string | null, customFileName?: string): string => {
  if (!url || typeof url !== 'string') return '#';
  
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return '#';
  }

  // If it's a Cloudinary media URL, insert attachment flag if not present
  if (trimmed.includes('cloudinary.com') && trimmed.includes('/upload/')) {
    if (!trimmed.includes('fl_attachment')) {
      const parts = trimmed.split('/upload/');
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  
  return trimmed;
};

export const compressImageFile = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(`local-file://${file.name}`);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(`local-file://${file.name}`);
    };
  });
};

export const uploadFileWithFallback = async (
  file: File,
  folder: 'alumni' | 'videos' | 'registration-files' | 'resources' | 'slideshow-images'
): Promise<string> => {
  // 1. Primary: Cloudinary (Direct Signed Upload or Server API Route)
  try {
    const cloudinaryUrl = await uploadToCloudinary(file, folder);
    if (cloudinaryUrl && (cloudinaryUrl.startsWith('http://') || cloudinaryUrl.startsWith('https://'))) {
      console.log(`Successfully uploaded ${file.name} to Cloudinary:`, cloudinaryUrl);
      return cloudinaryUrl;
    }
  } catch (err) {
    console.warn(`Cloudinary API upload failed for ${file.name}, trying Firebase Storage fallback:`, err);
  }

  // 2. Secondary: Firebase Storage
  const isFirebaseConfigured =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project';

  if (isFirebaseConfigured) {
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      if (downloadUrl && (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://'))) {
        return downloadUrl;
      }
    } catch (err) {
      console.warn(`Firebase Storage upload to ${folder} failed, using local fallback:`, err);
    }
  }

  // 3. Fallback: Data URL or local compression for images
  if (file.type.startsWith('image/')) {
    return compressImageFile(file, 1200, 0.75);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result && result.startsWith('data:')) {
        resolve(result);
      } else {
        resolve(`local-file://${file.name}`);
      }
    };
    reader.onerror = () => resolve(`local-file://${file.name}`);
    reader.readAsDataURL(file);
  });
};

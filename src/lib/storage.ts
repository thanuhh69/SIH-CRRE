import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const isCloudinaryActive = (): boolean => {
  return true; // Cloudinary credentials are fully configured for 'dwzv8izif'
};

/**
 * Uploads a file to Cloudinary via server API route /api/upload
 */
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
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
 */
export const getCloudinaryDownloadUrl = (url: string, customFileName?: string): string => {
  if (!url) return '#';
  
  // If it's a Cloudinary media URL, insert attachment flag if not present
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('fl_attachment')) {
      const parts = url.split('/upload/');
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  
  return url;
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
  // 1. Primary: Cloudinary Server API Route
  try {
    const cloudinaryUrl = await uploadToCloudinary(file, folder);
    console.log(`Successfully uploaded ${file.name} to Cloudinary:`, cloudinaryUrl);
    return cloudinaryUrl;
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
      return downloadUrl;
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
      if (result && result.length > 800000) {
        resolve(`local-file://${file.name}`);
      } else {
        resolve(result);
      }
    };
    reader.onerror = () => resolve(`local-file://${file.name}`);
    reader.readAsDataURL(file);
  });
};

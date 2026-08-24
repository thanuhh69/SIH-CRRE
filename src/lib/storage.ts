import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

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
      console.warn(`Firebase Storage upload to ${folder} failed, using data URL fallback:`, err);
    }
  }

  // Safe fallback with compression for images
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


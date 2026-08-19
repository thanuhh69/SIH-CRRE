import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFileWithFallback = async (
  file: File, 
  folder: 'alumni' | 'videos' | 'registration-files' | 'resources'
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

  // Fallback: Read file as base64 Data URL for instant preview & storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


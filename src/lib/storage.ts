import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

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

  // Fallback: Read file as base64 Data URL or safe reference
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result && result.length > 800000) {
        // Document size safeguard for Firestore (max 1MB per document)
        resolve(`local-file://${file.name}`);
      } else {
        resolve(result);
      }
    };
    reader.onerror = () => resolve(`local-file://${file.name}`);
    reader.readAsDataURL(file);
  });
};


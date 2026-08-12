// Utility for handling image/file upload with fallback
export const uploadFileWithFallback = async (
  file: File, 
  folder: 'alumni' | 'videos' | 'registration-files'
): Promise<string> => {
  return new Promise((resolve) => {
    // Read file as base64 Data URL for instant offline preview functionality
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

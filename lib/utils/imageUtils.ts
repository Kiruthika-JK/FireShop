import imageCompression from 'browser-image-compression';

/**
 * Validates if an image file has the expected aspect ratio
 * @param file - Image file to validate
 * @param expectedRatio - Expected aspect ratio (e.g., 4/3 for 4:3)
 * @param tolerance - Allowed tolerance for aspect ratio (default: 0.05)
 * @returns Promise<boolean> - True if aspect ratio matches within tolerance
 */
export async function validateImageAspectRatio(
  file: File,
  expectedRatio: number,
  tolerance: number = 0.05
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const actualRatio = img.width / img.height;
      const difference = Math.abs(actualRatio - expectedRatio);
      const isValid = difference <= tolerance;

      URL.revokeObjectURL(url);
      resolve(isValid);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 800
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Gets image dimensions from a file
 * @param file - Image file
 * @returns Promise<{width: number, height: number}>
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
    try {
        const timestamp = Date.now();
        const fileName = `thumbnail_${timestamp}.jpg`;
        const storageRef = ref(storage, `products/${productId}/${fileName}`);

        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading product image:', error);
        throw new Error('Failed to upload image');
    }
}

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    try {
        const url = new URL(imageUrl);
        const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
        
        if (!pathMatch) {
            throw new Error('Invalid image URL');
        }

        const path = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, path);

        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting product image:', error);
        // Don't throw error - image might already be deleted or URL invalid
        // Just log it and continue
    }
}

/**
 * Uploads multiple product images (for preview images)
 * @param files - Array of image files to upload
 * @param productId - Unique product ID
 * @returns Promise<string[]> - Array of download URLs
 */
export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = `preview_${index}_${timestamp}.jpg`;
        const storageRef = ref(storage, `products/${productId}/${fileName}`);

        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
}

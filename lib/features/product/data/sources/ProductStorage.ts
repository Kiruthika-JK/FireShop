import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

const sanitizeFileName = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export const uploadProductImage = async (file: File, productName: string): Promise<string> => {
    try {
        // Use fixed filename to ensure URL consistency for historical orders
        // Storage Path: products/{sanitized_name}/thumbnail.jpg
        const sanitizedName = sanitizeFileName(productName);
        const fileName = 'thumbnail.jpg';
        const storageRef = ref(storage, `products/${sanitizedName}/${fileName}`);

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
        // Handle both encoded and decoded URLs
        const url = new URL(imageUrl);
        // Firebase Storage URLs are like: .../o/path%2Fto%2Ffile?alt=...
        const pathStart = url.pathname.indexOf('/o/');
        if (pathStart === -1) return;

        let path = url.pathname.substring(pathStart + 3);
        path = decodeURIComponent(path);

        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        // Ignore if file not found
        console.error('Error deleting product image:', error);
    }
}

export async function uploadProductPreview(
    file: File,
    productName: string,
    fileName: string
): Promise<string> {
    const sanitizedName = sanitizeFileName(productName);
    const storageRef = ref(storage, `products/${sanitizedName}/previews/${fileName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { storage } from "../../../../../lib/firebase";

const sanitizeFileName = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

const getUniqueFileName = (fileName: string): string => {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    return `${sanitizeFileName(nameWithoutExt)}_${timestamp}.${extension}`;
}

export const uploadProductImage = async (file: File, productName: string): Promise<string> => {
    try {
        console.log(`Uploading thumbnail for ${productName}`);
        console.log('File details:', { name: file.name, size: file.size, type: file.type });
        
        // Check if user is authenticated
        const auth = getAuth();
        const currentUser = auth.currentUser;
        console.log('Current user authenticated:', !!currentUser);
        if (!currentUser) {
            throw new Error('User not authenticated. Please login to upload images.');
        }
        
        // Optimize image before upload
        const optimizedFile = await optimizeImage(file);
        console.log('Optimized file details:', { 
            name: optimizedFile.name, 
            size: optimizedFile.size, 
            type: optimizedFile.type,
            originalSize: file.size,
            compressionRatio: Math.round((1 - optimizedFile.size / file.size) * 100) + '%'
        });
        
        const safeProductName = sanitizeFileName(productName);
        const uniqueFileName = getUniqueFileName(optimizedFile.name);
        const storagePath = `products/${safeProductName}/${uniqueFileName}`;
        console.log('Storage path:', storagePath);
        
        const storageRef = ref(storage, storagePath);
        
        // Upload the optimized file
        console.log('Starting upload to Firebase Storage...');
        const snapshot = await uploadBytes(storageRef, optimizedFile);
        console.log('Upload completed, metadata:', snapshot.metadata);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Thumbnail uploaded successfully:', downloadURL);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        console.error('Error details:', {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack
        });
        
        // Provide more specific error messages
        if ((error as Error).message.includes('unauthorized') || (error as Error).message.includes('permission-denied')) {
            throw new Error('Permission denied. You must be logged in as an admin to upload images.');
        } else if ((error as Error).message.includes('storage/unauthorized')) {
            throw new Error('Storage access denied. Please check Firebase Storage rules.');
        } else if ((error as Error).message.includes('network')) {
            throw new Error('Network error. Please check your internet connection and try again.');
        } else {
            throw new Error(`Failed to upload thumbnail: ${(error as Error).message}`);
        }
    }
}

// Image optimization function
const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Calculate optimal dimensions (max 400px for thumbnail)
            const maxSize = 400;
            let { width, height } = img;
            
            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress image
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const optimizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                } else {
                    resolve(file); // Fallback to original file
                }
            }, 'image/jpeg', 0.8); // 80% quality
        };
        
        img.onerror = () => resolve(file); // Fallback to original file
        img.src = URL.createObjectURL(file);
    });
};

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    try {
        // Skip if not a firebase storage URL
        if (!imageUrl.includes('firebaseapp.com') && !imageUrl.includes('firebasestorage.googleapis.com')) {
            console.log('Ignoring deletion of non-firebase URL:', imageUrl);
            return;
        }

        console.log('Deleting image:', imageUrl);
        // We can create a ref directly from the download URL
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting product image:', error);
        // Do not throw if it fails, maybe it's already deleted or doesn't exist
    }
}

export async function uploadProductPreview(
    file: File,
    productName: string,
    fileName: string
): Promise<string> {
    try {
        console.log(`Uploading preview for ${productName}, file: ${fileName}`);
        console.log('Preview file details:', { name: file.name, size: file.size, type: file.type });
        
        // Check if user is authenticated
        const auth = getAuth();
        const currentUser = auth.currentUser;
        console.log('Current user authenticated for preview:', !!currentUser);
        if (!currentUser) {
            throw new Error('User not authenticated. Please login to upload images.');
        }
        
        const safeProductName = sanitizeFileName(productName);
        const uniqueFileName = getUniqueFileName(fileName);
        const storagePath = `products/${safeProductName}/previews/${uniqueFileName}`;
        console.log('Preview storage path:', storagePath);
        
        const storageRef = ref(storage, storagePath);
        
        // Upload the file
        console.log('Starting preview upload to Firebase Storage...');
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Preview upload completed, metadata:', snapshot.metadata);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Preview uploaded successfully:', downloadURL);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading preview:', error);
        console.error('Preview error details:', {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack
        });
        
        // Provide more specific error messages
        if ((error as Error).message.includes('unauthorized') || (error as Error).message.includes('permission-denied')) {
            throw new Error('Permission denied. You must be logged in as an admin to upload images.');
        } else if ((error as Error).message.includes('storage/unauthorized')) {
            throw new Error('Storage access denied. Please check Firebase Storage rules.');
        } else if ((error as Error).message.includes('network')) {
            throw new Error('Network error. Please check your internet connection and try again.');
        } else {
            throw new Error(`Failed to upload preview: ${(error as Error).message}`);
        }
    }
}

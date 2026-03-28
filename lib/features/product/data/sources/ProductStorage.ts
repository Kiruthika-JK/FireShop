const sanitizeFileName = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export const uploadProductImage = async (file: File, productName: string): Promise<string> => {
    try {
        console.log(`Uploading image for ${productName}, file size: ${file.size} bytes`);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productName', productName);
        formData.append('type', 'thumbnail');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('Image uploaded successfully:', result.url);
        
        return result.url;
        
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${(error as Error).message}`);
    }
}

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    try {
        console.log('Would delete image:', imageUrl);
        // For local files, deletion would require another API endpoint
        // For now, just log it
    } catch (error) {
        console.error('Error deleting product image:', error);
    }
}

export async function uploadProductPreview(
    file: File,
    productName: string,
    fileName: string
): Promise<string> {
    try {
        console.log(`Uploading preview for ${productName}, file: ${fileName}`);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productName', productName);
        formData.append('type', 'preview');
        formData.append('fileName', fileName);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('Preview uploaded successfully:', result.url);
        
        return result.url;
        
    } catch (error) {
        console.error('Error uploading preview:', error);
        throw new Error(`Failed to upload preview: ${(error as Error).message}`);
    }
}

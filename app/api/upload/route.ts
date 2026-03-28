import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

const sanitizeFileName = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productName = formData.get('productName') as string;
        const fileType = formData.get('type') as string || 'thumbnail'; // thumbnail or preview
        const fileName = formData.get('fileName') as string || 'thumbnail.jpg';

        if (!file || !productName) {
            return NextResponse.json(
                { error: 'Missing file or product name' },
                { status: 400 }
            );
        }

        console.log(`Saving local ${fileType} for ${productName}, file size: ${file.size} bytes`);
        
        // Create public/products directory if it doesn't exist
        const productsDir = join(process.cwd(), 'public', 'products');
        if (!existsSync(productsDir)) {
            await mkdir(productsDir, { recursive: true });
        }
        
        // Create product-specific directory
        const sanitizedName = sanitizeFileName(productName);
        const productDir = join(productsDir, sanitizedName);
        if (!existsSync(productDir)) {
            await mkdir(productDir, { recursive: true });
        }

        let filePath: string;
        let publicUrl: string;

        if (fileType === 'preview') {
            // Create previews directory
            const previewsDir = join(productDir, 'previews');
            if (!existsSync(previewsDir)) {
                await mkdir(previewsDir, { recursive: true });
            }
            filePath = join(previewsDir, fileName);
            publicUrl = `/products/${sanitizedName}/previews/${fileName}`;
        } else {
            // Thumbnail
            filePath = join(productDir, 'thumbnail.jpg');
            publicUrl = `/products/${sanitizedName}/thumbnail.jpg`;
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Write file
        await writeFile(filePath, buffer);
        
        console.log('Local file saved:', publicUrl);

        return NextResponse.json({ 
            success: true, 
            url: publicUrl,
            message: `${fileType} uploaded successfully`
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: `Failed to upload file: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}

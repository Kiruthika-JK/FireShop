import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function getProductUrl(product: ProductModel): string {
    const slug = slugify(product.name);
    return `/product/${slug}-${product.id}`;
}

export function getProductIdFromSlug(slugId: string): string {
    return slugId.slice(-20);
}

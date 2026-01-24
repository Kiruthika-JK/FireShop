export interface ProductModel {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountPercent: number; // integer (0-100)
    outOfStock: boolean;
    thumbnail?: string;
    previews: string[];
}

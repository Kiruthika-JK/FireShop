export interface ProductModel {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    thumbnail?: string;
    previews: string[];
}

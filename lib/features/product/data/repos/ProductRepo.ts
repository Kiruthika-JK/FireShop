import { IProductRepo } from "@/lib/features/product/domain/repos/IProductRepo";
import { ProductModel } from "@/lib/features/product/domain/models/ProductModel";

import { FirestoreProductsDs } from "../sources/FirestoreProductsDs";

export class ProductRepo implements IProductRepo {
    async getProducts(): Promise<ProductModel[]> {
        try {
            return await FirestoreProductsDs.getProducts();
        } catch (error) {
            console.error('Error fetching from Firestore:', error);
            return [];
        }
    }

    async getProductById(id: string): Promise<ProductModel | undefined> {
        try {
            const product = await FirestoreProductsDs.getProductById(id);
            return product || undefined;
        } catch (error) {
            console.error('Error fetching from Firestore:', error);
            return undefined;
        }
    }
}

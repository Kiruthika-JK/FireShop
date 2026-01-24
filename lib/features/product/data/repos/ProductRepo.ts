import { IProductRepo } from "@/lib/features/product/domain/repos/IProductRepo";
import { ProductModel } from "@/lib/features/product/domain/models/ProductModel";
import { StaticProductsDs } from "../sources/StaticProductsDs";
import { FirestoreProductsDs } from "../sources/FirestoreProductsDs";

export class ProductRepo implements IProductRepo {
    async getProducts(): Promise<ProductModel[]> {
        try {
            // Try to get products from Firestore
            const firestoreProducts = await FirestoreProductsDs.getProducts();
            
            // If Firestore has products, return them
            if (firestoreProducts.length > 0) {
                return firestoreProducts;
            }
            
            // Fallback to static products for development
            return StaticProductsDs.PRODUCTS;
        } catch (error) {
            console.error('Error fetching from Firestore, using static data:', error);
            // Fallback to static products if Firestore fails
            return StaticProductsDs.PRODUCTS;
        }
    }

    async getProductById(id: string): Promise<ProductModel | undefined> {
        try {
            // Try to get product from Firestore
            const firestoreProduct = await FirestoreProductsDs.getProductById(id);
            
            if (firestoreProduct) {
                return firestoreProduct;
            }
            
            // Fallback to static products
            return StaticProductsDs.PRODUCTS.find(p => p.id === id);
        } catch (error) {
            console.error('Error fetching from Firestore, using static data:', error);
            // Fallback to static products if Firestore fails
            return StaticProductsDs.PRODUCTS.find(p => p.id === id);
        }
    }
}

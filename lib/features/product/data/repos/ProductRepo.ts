import { IProductRepo } from "@/lib/features/product/domain/repos/IProductRepo";
import { ProductModel } from "@/lib/features/product/domain/models/ProductModel";
import { StaticProductsDs } from "../sources/StaticProductsDs";

export class ProductRepo implements IProductRepo {
    getProducts(): ProductModel[] {
        return StaticProductsDs.PRODUCTS;
    }
    getProductById(id: string): ProductModel | undefined {
        return StaticProductsDs.PRODUCTS.find(p => p.id === id);
    }
}

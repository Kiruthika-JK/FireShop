import { ProductModel } from "../models/ProductModel";

export interface IProductRepo {
    getProducts(): Promise<ProductModel[]>;
    getProductById(id: string): Promise<ProductModel | undefined>;
}

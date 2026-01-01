import { ProductModel } from "../models/ProductModel";

export interface IProductRepo {
    getProducts(): ProductModel[];
    getProductById(id: string): ProductModel | undefined;
}

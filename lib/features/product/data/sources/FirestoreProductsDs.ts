import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "../../../../../lib/firebase";
import { ProductModel } from "../../domain/models/ProductModel";

export class FirestoreProductsDs {
  private static COLLECTION_NAME = "products";

  static async getProducts(): Promise<ProductModel[]> {
    const productsRef = collection(firestore, this.COLLECTION_NAME);
    const querySnapshot = await getDocs(productsRef);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProductModel));

    // Client-side sort to support existing products that lack categoryPosition/productPosition fields.
    // Firestore `orderBy` completely filters out documents that do not contain the field being ordered.
    return products.sort((a, b) => {
      const cPosA = a.categoryPosition || 0;
      const cPosB = b.categoryPosition || 0;
      if (cPosA !== cPosB) return cPosA - cPosB;

      const pPosA = a.productPosition || 0;
      const pPosB = b.productPosition || 0;
      if (pPosA !== pPosB) return pPosA - pPosB;

      return (a.name || '').localeCompare(b.name || '');
    });
  }

  static async getProductById(id: string): Promise<ProductModel | null> {
    const docRef = doc(firestore, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProductModel;
    }
    return null;
  }

  static async addProduct(product: Omit<ProductModel, 'id'>): Promise<string> {
    console.log('FirestoreProductsDs.addProduct - Input data:', {
      name: product.name,
      thumbnail: product.thumbnail,
      previews: product.previews,
      category: product.category,
      fullProduct: product
    });
    const docRef = await addDoc(collection(firestore, this.COLLECTION_NAME), product);
    console.log('FirestoreProductsDs.addProduct - Document created with ID:', docRef.id);
    return docRef.id;
  }

  static async updateProduct(id: string, product: Partial<ProductModel>): Promise<void> {
    console.log('FirestoreProductsDs.updateProduct - Input data:', {
      id: id,
      name: product.name,
      thumbnail: product.thumbnail,
      previews: product.previews,
      category: product.category,
      fullProduct: product
    });
    const docRef = doc(firestore, this.COLLECTION_NAME, id);
    // Remove id from update data if present
    const { id: _, ...updateData } = product as any;
    console.log('FirestoreProductsDs.updateProduct - Update data:', updateData);
    await updateDoc(docRef, updateData);
    console.log('FirestoreProductsDs.updateProduct - Document updated successfully');
  }

  static async deleteProduct(id: string): Promise<void> {
    const docRef = doc(firestore, this.COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
}

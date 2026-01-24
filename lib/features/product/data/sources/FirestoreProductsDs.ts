import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "../../../../../lib/firebase";
import { ProductModel } from "../../domain/models/ProductModel";

export class FirestoreProductsDs {
  private static COLLECTION_NAME = "products";

  static async getProducts(): Promise<ProductModel[]> {
    const productsRef = collection(firestore, this.COLLECTION_NAME);
    const q = query(productsRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProductModel));
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
    const docRef = await addDoc(collection(firestore, this.COLLECTION_NAME), product);
    return docRef.id;
  }

  static async updateProduct(id: string, product: Partial<ProductModel>): Promise<void> {
    const docRef = doc(firestore, this.COLLECTION_NAME, id);
    // Remove id from update data if present
    const { id: _, ...updateData } = product as any;
    await updateDoc(docRef, updateData);
  }

  static async deleteProduct(id: string): Promise<void> {
    const docRef = doc(firestore, this.COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
}

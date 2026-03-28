'use client';

import { useState, useEffect } from 'react';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';

interface ProductProviderProps {
  children: (products: ProductModel[]) => React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProductProvider({ children, loadingComponent }: ProductProviderProps) {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await FirestoreProductsDs.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <>{loadingComponent || <div>Loading products...</div>}</>;
  }

  return <>{children(products)}</>;
}

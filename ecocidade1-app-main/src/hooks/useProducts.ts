import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

export const useProducts = (category?: string, searchTerm?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsQuery = collection(db, 'products');
        
        if (category) {
          productsQuery = query(productsQuery, where('category', '==', category));
        }
        
        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        if (searchTerm) {
          const filtered = productsData.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(filtered);
        } else {
          setProducts(productsData);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm]);

  return { products, loading, error };
};
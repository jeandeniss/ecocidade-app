import { useState, useEffect } from 'react';
import { Product } from '../types';
import { perplexityAI } from '../services/perplexityAI';
import { useStore } from '../store/useStore';

export const useComparison = (category?: string) => {
  const { user } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Pass user preferences to get personalized recommendations
        const userPreferences = user?.preferences || null;
        const comparisonProducts = await perplexityAI.getComparisonProducts(category, userPreferences);
        setProducts(comparisonProducts);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar produtos para comparação');
        console.error('Error fetching comparison products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, user]);

  const selectProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else if (selectedProducts.length < 2) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  return {
    products,
    loading,
    error,
    selectedProducts,
    selectProduct,
    clearSelection
  };
};
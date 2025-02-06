import { useState, useEffect } from 'react';
import { Product } from '../types';
import { platformIntegrationService } from '../services/platformIntegration';

export const usePlatformProducts = (query: string, platforms: string[] = ['amazon', 'ebay']) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productPromises = platforms.map(platform =>
          platformIntegrationService.searchProducts(query, platform)
        );

        const results = await Promise.all(productPromises);
        const allProducts = results.flat();

        // Sort by sustainability score
        const sortedProducts = allProducts.sort(
          (a, b) => b.sustainabilityScore - a.sustainabilityScore
        );

        setProducts(sortedProducts);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query, platforms]);

  return { products, loading, error };
};
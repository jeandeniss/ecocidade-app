import { useState, useEffect } from 'react';
import { perplexityAI } from '../services/perplexityAI';
import { Product } from '../types';

interface SearchResult {
  products: Product[];
  suggestions: string[];
  analysis: {
    sustainabilityScore: number;
    environmentalImpact: string;
    recommendations: string[];
  };
  loading: boolean;
  error: string | null;
}

export const useSearch = (query: string) => {
  const [result, setResult] = useState<SearchResult>({
    products: [],
    suggestions: [],
    analysis: {
      sustainabilityScore: 0,
      environmentalImpact: '',
      recommendations: []
    },
    loading: false,
    error: null
  });

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) return;

      setResult(prev => ({ ...prev, loading: true, error: null }));

      try {
        const searchResult = await perplexityAI.searchProducts(query);
        setResult({
          products: searchResult.analysis.products,
          suggestions: searchResult.suggestions,
          analysis: {
            sustainabilityScore: searchResult.analysis.sustainabilityScore,
            environmentalImpact: searchResult.analysis.environmentalImpact,
            recommendations: searchResult.analysis.recommendations
          },
          loading: false,
          error: null
        });
      } catch (error) {
        setResult(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to search for products. Please try again.'
        }));
      }
    };

    searchProducts();
  }, [query]);

  return result;
};
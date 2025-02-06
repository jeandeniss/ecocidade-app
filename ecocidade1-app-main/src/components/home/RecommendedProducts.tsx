import React from 'react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { ProductCard } from '../products/ProductCard';
import { Sparkles } from 'lucide-react';

export const RecommendedProducts: React.FC = () => {
  const { recommendations, loading, error } = useRecommendations();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Recomendados para você
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md h-96 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Recomendados para você
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
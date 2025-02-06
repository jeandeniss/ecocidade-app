import React from 'react';
import { Leaf, Award } from 'lucide-react';

interface FeaturedProduct {
  name: string;
  description: string;
  sustainabilityFeatures: string[];
  imageUrl: string;
  estimatedPrice: string;
}

interface SearchResultsProps {
  analysis: {
    sustainabilityScore: number;
    environmentalImpact: string;
    recommendations: string[];
    featuredProducts: FeaturedProduct[];
  };
}

export const SearchResults: React.FC<SearchResultsProps> = ({ analysis }) => {
  return (
    <div className="space-y-8">
      {/* Featured Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.featuredProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-semibold">
                    {product.estimatedPrice}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Leaf className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-emerald-600">Eco-friendly</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Características Sustentáveis:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sustainabilityFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
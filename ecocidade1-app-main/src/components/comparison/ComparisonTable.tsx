import React from 'react';
import { Product } from '../../types';
import { Check, X, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface ComparisonTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  products,
  onRemoveProduct
}) => {
  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } = useStore();

  if (products.length === 0) return null;

  const compareFeatures = [
    { label: 'Preço', key: 'price' },
    { label: 'Certificações', key: 'certifications' },
    { label: 'Plataforma', key: 'platform' }
  ];

  const handleFavoriteClick = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 border border-emerald-100 w-full">
      <div className="max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
        {/* Products Header */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {products.map(product => (
            <div key={product.id} className="relative">
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors z-10"
                title="Remover da comparação"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="bg-emerald-50 rounded-lg p-2">
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                  {isAuthenticated && (
                    <button
                      onClick={() => handleFavoriteClick(product)}
                      className={`absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors ${
                        isFavorite(product.id) ? 'bg-red-50' : ''
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite(product.id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  )}
                </div>
                <h3 className="font-medium text-gray-800 text-sm text-center line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="space-y-3">
          {compareFeatures.map(({ label, key }) => (
            <div key={key} className="grid grid-cols-[100px_1fr] gap-4">
              <div className="font-medium text-gray-600 text-sm py-1">
                {label}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-center"
                  >
                    {key === 'price' && (
                      <span className="text-emerald-600 font-semibold text-sm">
                        €{product[key].toFixed(2)}
                      </span>
                    )}
                    {key === 'certifications' && (
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {product[key].map((cert: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {key === 'platform' && (
                      <span className="text-gray-600 text-sm">{product[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-[100px_1fr] gap-4 mt-4 pt-4 border-t">
          <div className="font-medium text-gray-600 text-sm py-1">
            Ação
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="text-center">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Ver Produto
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteClick = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors ${
            isProductFavorite ? 'bg-red-50' : ''
          }`}
        >
          <Heart
            className={`h-5 w-5 ${
              isProductFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.certifications.map((cert, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
            >
              {cert}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            €{product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            via {product.platform}
          </span>
        </div>
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Ver Produto
        </a>
      </div>
    </div>
  );
};
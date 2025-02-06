import React, { useState } from 'react';
import { Heart, ExternalLink, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const FavoritesList: React.FC = () => {
  const { favorites, removeFromFavorites, clearAllFavorites } = useStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClearAll = async () => {
    const success = await clearAllFavorites();
    if (success) {
      setShowConfirmation(false);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Meus Favoritos</h2>
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Você ainda não tem produtos favoritos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Meus Favoritos</h2>
        <button
          onClick={() => setShowConfirmation(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover Todos os Favoritos
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmar Remoção
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover todos os itens da sua lista de favoritos? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Sim, Remover Todos
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                  >
                    {cert}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-emerald-600">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    via {product.platform}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <span className="mr-1">Ver Produto</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    title="Remover dos favoritos"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
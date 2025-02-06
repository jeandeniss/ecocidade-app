import React, { useState } from 'react';
import { Plus, Calendar, Clock, Target } from 'lucide-react';
import { useAds } from '../../hooks/useAds';

export const AdvertisingManager: React.FC = () => {
  const { ads, createAd, updateAd, deleteAd } = useAds();
  const [isAddingNew, setIsAddingNew] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Anúncios</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Anúncio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {ad.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{ad.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(ad.startDate).toLocaleDateString()} - 
                  {new Date(ad.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Frequência: {ad.frequency}x/dia</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-2" />
                <span>Público: {ad.targetAudience}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between">
              <button
                onClick={() => updateAd(ad.id)}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Editar
              </button>
              <button
                onClick={() => deleteAd(ad.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
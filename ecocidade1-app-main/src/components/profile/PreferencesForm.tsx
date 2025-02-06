import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types';
import { useStore } from '../../store/useStore';

interface PreferencesFormProps {
  user: User;
}

const categories = [
  { id: 'food', label: 'Alimentação Sustentável' },
  { id: 'fashion', label: 'Moda e Acessórios' },
  { id: 'energy', label: 'Energia e Eletrodomésticos' },
  { id: 'beauty', label: 'Beleza e Cuidados' },
  { id: 'home', label: 'Casa e Jardim' },
  { id: 'mobility', label: 'Mobilidade' },
];

const sustainabilityPreferences = [
  { id: 'organic', label: 'Produtos Orgânicos' },
  { id: 'vegan', label: 'Produtos Veganos' },
  { id: 'recycled', label: 'Materiais Reciclados' },
  { id: 'plastic_free', label: 'Livre de Plástico' },
  { id: 'fair_trade', label: 'Comércio Justo' },
];

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ user }) => {
  const { setUser } = useStore();
  const [preferences, setPreferences] = useState(user.preferences);

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        preferences,
      });

      setUser({ ...user, preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = preferences.categories.includes(categoryId)
      ? preferences.categories.filter(id => id !== categoryId)
      : [...preferences.categories, categoryId];

    setPreferences({
      ...preferences,
      categories: updatedCategories,
    });
  };

  const handleSustainabilityChange = (prefId: string) => {
    const updatedPrefs = preferences.sustainabilityPreferences.includes(prefId)
      ? preferences.sustainabilityPreferences.filter(id => id !== prefId)
      : [...preferences.sustainabilityPreferences, prefId];

    setPreferences({
      ...preferences,
      sustainabilityPreferences: updatedPrefs,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferências</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Categorias de Interesse
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.categories.includes(id)}
                  onChange={() => handleCategoryChange(id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Preferências de Sustentabilidade
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {sustainabilityPreferences.map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.sustainabilityPreferences.includes(id)}
                  onChange={() => handleSustainabilityChange(id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Faixa de Preço
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mínimo (R$)
              </label>
              <input
                type="number"
                value={preferences.priceRange.min}
                onChange={(e) => setPreferences({
                  ...preferences,
                  priceRange: {
                    ...preferences.priceRange,
                    min: Number(e.target.value),
                  },
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo (R$)
              </label>
              <input
                type="number"
                value={preferences.priceRange.max}
                onChange={(e) => setPreferences({
                  ...preferences,
                  priceRange: {
                    ...preferences.priceRange,
                    max: Number(e.target.value),
                  },
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Salvar Preferências
        </button>
      </div>
    </div>
  );
};
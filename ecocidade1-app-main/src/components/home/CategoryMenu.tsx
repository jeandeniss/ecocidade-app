import React from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Zap, 
  Sparkles, 
  Home, 
  Car 
} from 'lucide-react';

const categories = [
  { id: 'food', name: 'Alimentação Sustentável', icon: Utensils },
  { id: 'fashion', name: 'Moda e Acessórios', icon: ShoppingBag },
  { id: 'energy', name: 'Energia e Eletrodomésticos', icon: Zap },
  { id: 'beauty', name: 'Beleza e Cuidados', icon: Sparkles },
  { id: 'home', name: 'Casa e Jardim', icon: Home },
  { id: 'mobility', name: 'Mobilidade', icon: Car },
];

interface CategoryMenuProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id === selectedCategory ? null : category.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                category.id === selectedCategory
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-emerald-600'
              }`}
            >
              <category.icon className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
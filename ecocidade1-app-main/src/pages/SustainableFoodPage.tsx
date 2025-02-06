import React from 'react';
import { Utensils, Award, Leaf } from 'lucide-react';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProducts } from '../hooks/useProducts';

export const SustainableFoodPage: React.FC = () => {
  const { products, loading, error } = useProducts('food');

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white py-12 px-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Alimentação Sustentável"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Utensils className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Alimentação Sustentável</h1>
          </div>
          <p className="text-xl max-w-3xl">
            Descubra produtos alimentícios que respeitam o meio ambiente e promovem
            uma vida mais saudável.
          </p>
        </div>
      </div>

      {/* Featured Ad Section */}
      <div className="max-w-7xl mx-auto px-4">
        <a
          href="https://exemplo.com/promocao-alimentos-organicos"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-12 w-12 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold text-emerald-800">
                  Produtos Orgânicos em Destaque
                </h2>
                <p className="text-emerald-600">
                  Aproveite 20% de desconto em produtos selecionados
                </p>
              </div>
            </div>
            <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
              Ver Ofertas
            </span>
          </div>
        </a>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Produtos Disponíveis
          </h2>
          <div className="flex items-center space-x-2 text-emerald-600">
            <Leaf className="h-5 w-5" />
            <span className="font-medium">100% Sustentável</span>
          </div>
        </div>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};
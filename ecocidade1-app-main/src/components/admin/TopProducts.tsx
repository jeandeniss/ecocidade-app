import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TopProductsProps {
  products: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos Mais Vendidos</h3>
      <div className="space-y-4">
        {products.map(product => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.sales} vendas</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-600">
                R$ {product.revenue.toFixed(2)}
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{((product.sales / 100) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
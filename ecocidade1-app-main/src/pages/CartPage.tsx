import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // TODO: Implement checkout process
    console.log('Proceeding to checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-600 mb-8">Adicione produtos sustentáveis ao seu carrinho</p>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Seu Carrinho</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center py-4 border-b last:border-b-0"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            
            <div className="flex-1 ml-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {item.product.description}
              </p>
              <div className="flex items-center">
                <span className="text-emerald-600 font-semibold">
                  R$ {item.product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-emerald-600">
              R$ {cart.total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <button
              onClick={clearCart}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpar Carrinho
            </button>
            <button
              onClick={handleCheckout}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
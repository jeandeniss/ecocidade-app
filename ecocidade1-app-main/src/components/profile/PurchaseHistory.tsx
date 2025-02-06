import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useStore } from '../../store/useStore';

interface Purchase {
  id: string;
  date: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const PurchaseHistory: React.FC = () => {
  const { user } = useStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        if (!user) return;

        const purchasesRef = collection(db, 'purchases');
        const q = query(purchasesRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);

        const purchasesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Purchase[];

        setPurchases(purchasesData);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Histórico de Compras
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Histórico de Compras
        </h2>
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Você ainda não realizou nenhuma compra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Histórico de Compras
      </h2>

      <div className="space-y-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="border rounded-md p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Pedido #{purchase.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg font-semibold text-emerald-600">
                R$ {purchase.total.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {purchase.products.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-800">
                    {product.name} x{product.quantity}
                  </span>
                  <span className="text-gray-600">
                    R$ {(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
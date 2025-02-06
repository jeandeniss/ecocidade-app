import React from 'react';
import { Crown, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types';
import { useStore } from '../../store/useStore';

interface SubscriptionManagerProps {
  user: User;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user }) => {
  const { setUser } = useStore();

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // TODO: Create checkout session with your backend
      console.log('Redirecting to checkout...');
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  const handleCancel = async () => {
    try {
      // TODO: Cancel subscription with your backend
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        isPremium: false,
      });

      setUser({ ...user, isPremium: false });
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Crown className="h-6 w-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-800">Premium</h2>
      </div>

      {user.isPremium ? (
        <div>
          <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span className="font-medium">Assinatura Ativa</span>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Experiência sem anúncios</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Recomendações personalizadas</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Alertas de ofertas exclusivas</span>
            </li>
          </ul>

          <button
            onClick={handleCancel}
            className="w-full border border-red-500 text-red-500 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            Cancelar Assinatura
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Assine o plano Premium e tenha acesso a benefícios exclusivos.
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Experiência sem anúncios</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Recomendações personalizadas</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Alertas de ofertas exclusivas</span>
            </li>
          </ul>

          <button
            onClick={handleSubscribe}
            className="w-full bg-gray-500 text-white py-2 rounded-md cursor-not-allowed"
            disabled
          >
            Em breve
          </button>
        </div>
      )}
    </div>
  );
};
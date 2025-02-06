import React from 'react';
import { usePayment } from '../../hooks/usePayment';
import { User } from '../../types';

interface SubscriptionButtonProps {
  user: User;
  subscriptionId?: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  user,
  subscriptionId,
}) => {
  const { subscribe, cancelSubscription, loading, error } = usePayment();

  const handleClick = async () => {
    if (user.isPremium && subscriptionId) {
      await cancelSubscription(subscriptionId);
    } else {
      await subscribe();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md ${
          user.isPremium
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        } transition-colors duration-200`}
      >
        {loading ? (
          'Processando...'
        ) : user.isPremium ? (
          'Cancelar Assinatura'
        ) : (
          'Assinar Premium'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
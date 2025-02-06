import { useState } from 'react';
import { stripeService } from '../services/stripe';
import { useStore } from '../store/useStore';

export const usePayment = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    if (!user) {
      setError('User must be logged in to subscribe');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await stripeService.createSubscription(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await stripeService.cancelSubscription(subscriptionId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    cancelSubscription,
    loading,
    error,
  };
};
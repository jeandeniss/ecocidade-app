import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { User } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export class StripeService {
  private static instance: StripeService;

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createSubscription(user: User) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      // Create a subscription session
      const session = await axios.post('/api/create-subscription', {
        userId: user.id,
        priceId: 'price_H5ggYwtDq4fbrJ', // Premium subscription price ID
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      await axios.post('/api/cancel-subscription', {
        subscriptionId,
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export const stripeService = StripeService.getInstance();
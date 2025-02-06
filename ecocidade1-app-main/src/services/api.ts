import axios from 'axios';
import { Product, User } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchProducts = async (
  query: string,
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minSustainabilityScore?: number;
    certifications?: string[];
  }
): Promise<Product[]> => {
  try {
    const response = await api.get('/products/search', {
      params: {
        q: query,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductRecommendations = async (user: User): Promise<Product[]> => {
  try {
    const response = await api.get('/products/recommendations', {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const updateUserPreferences = async (
  userId: string,
  preferences: User['preferences']
): Promise<void> => {
  try {
    await api.put(`/users/${userId}/preferences`, preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

export const createSubscription = async (userId: string): Promise<void> => {
  try {
    await api.post('/subscriptions', { userId });
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/subscriptions/${userId}`);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};
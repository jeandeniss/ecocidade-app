import { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useRecommendations = () => {
  const { user } = useStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', 'in', user.preferences.categories)
        );
        const querySnapshot = await getDocs(q);
        
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        // Sort by sustainability score and user preferences
        const sortedProducts = products.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, user);
          const scoreB = calculateRelevanceScore(b, user);
          return scoreB - scoreA;
        });

        setRecommendations(sortedProducts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return { recommendations, loading, error };
};

const calculateRelevanceScore = (product: Product, user: any): number => {
  let score = product.sustainabilityScore;

  // Add points for matching user preferences
  if (user.preferences.categories.includes(product.category)) {
    score += 2;
  }

  if (product.price >= user.preferences.priceRange.min &&
      product.price <= user.preferences.priceRange.max) {
    score += 2;
  }

  // Add points for matching sustainability preferences
  user.preferences.sustainabilityPreferences.forEach((pref: string) => {
    if (product.certifications.includes(pref)) {
      score += 1;
    }
  });

  return score;
};
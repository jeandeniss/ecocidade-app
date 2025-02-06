import { Product, User } from '../types';
import * as tf from '@tensorflow/tfjs';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export class RecommendationService {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Initialize TensorFlow.js model
    this.model = await tf.loadLayersModel('/models/recommendation-model.json');
  }

  async getPersonalizedRecommendations(user: User): Promise<Product[]> {
    try {
      // Get user preferences and history
      const userFeatures = this.extractUserFeatures(user);
      
      // Get available products
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Generate predictions for each product
      const predictions = products.map(product => {
        const productFeatures = this.extractProductFeatures(product);
        const combinedFeatures = tf.tensor2d([...userFeatures, ...productFeatures], [1, -1]);
        const prediction = this.model!.predict(combinedFeatures) as tf.Tensor;
        return {
          product,
          score: prediction.dataSync()[0]
        };
      });

      // Sort products by prediction score
      const sortedProducts = predictions
        .sort((a, b) => b.score - a.score)
        .map(p => p.product);

      return sortedProducts;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  private extractUserFeatures(user: User): number[] {
    // Convert user preferences to numerical features
    const features = [
      user.preferences.categories.length,
      user.preferences.priceRange.max,
      user.preferences.sustainabilityPreferences.length,
      user.isPremium ? 1 : 0
    ];
    return features;
  }

  private extractProductFeatures(product: Product): number[] {
    // Convert product attributes to numerical features
    const features = [
      product.price,
      product.sustainabilityScore,
      product.certifications.length
    ];
    return features;
  }
}

export const recommendationService = new RecommendationService();
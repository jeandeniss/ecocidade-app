import * as tf from '@tensorflow/tfjs';
import { Product, User } from '../types';

export class AIRecommendationService {
  private model: tf.LayersModel | null = null;

  async initialize() {
    try {
      // Create a simple neural network for product recommendations
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
    } catch (error) {
      console.error('Error initializing AI model:', error);
    }
  }

  async getPersonalizedRecommendations(user: User, products: Product[]): Promise<Product[]> {
    if (!this.model) {
      await this.initialize();
    }

    try {
      const productFeatures = products.map(product => this.extractFeatures(product, user));
      const tensorFeatures = tf.tensor2d(productFeatures);
      const predictions = this.model!.predict(tensorFeatures) as tf.Tensor;
      const scores = await predictions.data();

      // Combine products with their scores and sort
      const scoredProducts = products.map((product, index) => ({
        product,
        score: scores[index]
      }));

      scoredProducts.sort((a, b) => b.score - a.score);

      return scoredProducts.map(({ product }) => product);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return products;
    }
  }

  private extractFeatures(product: Product, user: User): number[] {
    const features = [
      product.price / 1000, // Normalized price
      product.sustainabilityScore / 10, // Normalized sustainability score
      product.certifications.length / 5, // Normalized certification count
      user.preferences.categories.includes(product.category) ? 1 : 0,
      user.preferences.priceRange.min <= product.price ? 1 : 0,
      user.preferences.priceRange.max >= product.price ? 1 : 0,
      user.isPremium ? 1 : 0,
      // Add more features as needed
      0, 0, 0 // Padding to match input shape
    ];

    return features;
  }

  async trainModel(trainingData: Array<{ product: Product; user: User; purchased: boolean }>) {
    if (!this.model) {
      await this.initialize();
    }

    const features = trainingData.map(({ product, user }) => 
      this.extractFeatures(product, user)
    );
    const labels = trainingData.map(({ purchased }) => purchased ? 1 : 0);

    const tensorFeatures = tf.tensor2d(features);
    const tensorLabels = tf.tensor1d(labels);

    await this.model!.fit(tensorFeatures, tensorLabels, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2
    });
  }
}

export const aiRecommendationService = new AIRecommendationService();
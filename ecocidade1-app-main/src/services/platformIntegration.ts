import axios from 'axios';
import { Product } from '../types';

interface PlatformConfig {
  apiKey: string;
  baseUrl: string;
  affiliateId: string;
}

const platforms: Record<string, PlatformConfig> = {
  amazon: {
    apiKey: import.meta.env.VITE_AMAZON_API_KEY,
    baseUrl: 'https://webservices.amazon.com/paapi5',
    affiliateId: import.meta.env.VITE_AMAZON_AFFILIATE_ID
  },
  ebay: {
    apiKey: import.meta.env.VITE_EBAY_API_KEY,
    baseUrl: 'https://api.ebay.com/buy/browse/v1',
    affiliateId: import.meta.env.VITE_EBAY_AFFILIATE_ID
  },
  rakuten: {
    apiKey: import.meta.env.VITE_RAKUTEN_API_KEY,
    baseUrl: 'https://app.rakuten.com/services/api/v1',
    affiliateId: import.meta.env.VITE_RAKUTEN_AFFILIATE_ID
  }
};

export class PlatformIntegrationService {
  async searchProducts(query: string, platform: string): Promise<Product[]> {
    const config = platforms[platform];
    if (!config) throw new Error(`Platform ${platform} not supported`);

    try {
      const response = await axios.get(`${config.baseUrl}/search`, {
        params: {
          q: query,
          apiKey: config.apiKey,
          affiliateId: config.affiliateId
        }
      });

      return this.mapToProducts(response.data, platform);
    } catch (error) {
      console.error(`Error searching products on ${platform}:`, error);
      return [];
    }
  }

  private mapToProducts(data: any, platform: string): Product[] {
    // Map platform-specific response to our Product type
    switch (platform) {
      case 'amazon':
        return data.items.map((item: any) => ({
          id: item.ASIN,
          name: item.title,
          description: item.description,
          price: parseFloat(item.price.amount),
          category: item.category,
          imageUrl: item.imageUrl,
          sustainabilityScore: this.calculateSustainabilityScore(item),
          certifications: this.extractCertifications(item),
          affiliateLink: item.detailPageURL,
          platform: 'amazon'
        }));

      case 'ebay':
        return data.itemSummaries.map((item: any) => ({
          id: item.itemId,
          name: item.title,
          description: item.shortDescription,
          price: parseFloat(item.price.value),
          category: item.categories[0].categoryName,
          imageUrl: item.image.imageUrl,
          sustainabilityScore: this.calculateSustainabilityScore(item),
          certifications: this.extractCertifications(item),
          affiliateLink: item.itemAffiliateWebUrl,
          platform: 'ebay'
        }));

      default:
        return [];
    }
  }

  private calculateSustainabilityScore(item: any): number {
    // Implement sustainability scoring logic based on product attributes
    let score = 5; // Base score

    // Add points for eco-friendly attributes
    if (item.ecoFriendly) score += 2;
    if (item.recyclable) score += 1;
    if (item.organicCertified) score += 1;
    if (item.sustainablePackaging) score += 1;

    return Math.min(score, 10); // Cap at 10
  }

  private extractCertifications(item: any): string[] {
    const certifications: string[] = [];

    // Extract certifications from product data
    if (item.organicCertified) certifications.push('Organic');
    if (item.fairTradeCertified) certifications.push('Fair Trade');
    if (item.ecoCertified) certifications.push('Eco Certified');

    return certifications;
  }
}

export const platformIntegrationService = new PlatformIntegrationService();
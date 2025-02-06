import axios from 'axios';
import { Product } from '../types';

interface ScrapingResult {
  validUrl: string;
  imageUrl?: string;
  price?: number;
}

export class ScrapingService {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private readonly timeout = 5000;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private readonly europeanDomains = ['.pt', '.eu', '.es', '.fr', '.de', '.it', '.nl', '.be'];

  async validateProductUrl(url: string): Promise<ScrapingResult | null> {
    // Check if the URL is from a European domain
    if (!this.isEuropeanDomain(url)) {
      console.warn('URL is not from a European domain:', url);
      return null;
    }

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept-Language': 'pt-PT,pt;q=0.9,en-PT;q=0.8,en;q=0.7', // Prefer Portuguese content
            'Accept-Currency': 'EUR' // Request prices in euros
          },
          timeout: this.timeout,
          maxRedirects: 5
        });

        if (response.status === 200) {
          const html = response.data;
          const price = this.extractPrice(html);
          
          return {
            validUrl: response.request.res.responseUrl || url,
            imageUrl: this.extractProductImage(html),
            price: price ? this.ensureEuros(price) : undefined
          };
        }
      } catch (error) {
        if (attempt === this.maxRetries - 1) {
          console.warn('Error validating product URL:', error);
          return null;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
      }
    }
    return null;
  }

  private isEuropeanDomain(url: string): boolean {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      return this.europeanDomains.some(tld => domain.endsWith(tld));
    } catch {
      return false;
    }
  }

  private extractProductImage(html: string): string | undefined {
    try {
      const patterns = [
        /<meta\s+property="og:image"\s+content="([^"]+)"/i,
        /<meta\s+name="twitter:image"\s+content="([^"]+)"/i,
        /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
        /<img[^>]+id="[^"]*product[^"]*"[^>]+src="([^"]+)"/i
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch (error) {
      console.warn('Error extracting product image:', error);
    }
    return undefined;
  }

  private extractPrice(html: string): number | undefined {
    try {
      const patterns = [
        /data-price="([0-9.,]+)"/i,
        /class="[^"]*price[^"]*"[^>]*>[^0-9]*([0-9.,]+)/i,
        /itemtype="http:\/\/schema.org\/Product"[^>]*>.*?"price":\s*([0-9.,]+)/i,
        /€\s*([0-9.,]+)/i,
        /([0-9.,]+)\s*€/i
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return this.parsePrice(match[1]);
        }
      }
    } catch (error) {
      console.warn('Error extracting price:', error);
    }
    return undefined;
  }

  private parsePrice(priceStr: string): number {
    // Remove all non-numeric characters except . and ,
    const normalized = priceStr.replace(/[^\d.,]/g, '');
    
    // Handle different European price formats
    if (normalized.includes(',') && normalized.includes('.')) {
      // Format: 1.234,56
      return parseFloat(normalized.replace('.', '').replace(',', '.'));
    } else if (normalized.includes(',')) {
      // Format: 1234,56
      return parseFloat(normalized.replace(',', '.'));
    } else {
      // Format: 1234.56
      return parseFloat(normalized);
    }
  }

  private ensureEuros(price: number): number {
    // Ensure the price is in euros and has 2 decimal places
    return Math.round(price * 100) / 100;
  }

  async validateAndEnrichProduct(product: Product): Promise<Product> {
    try {
      if (!product.affiliateLink || product.affiliateLink === '#') {
        return {
          ...product,
          price: this.ensureEuros(product.price) // Ensure price is in euros
        };
      }

      const scrapingResult = await this.validateProductUrl(product.affiliateLink);
      if (!scrapingResult) {
        return {
          ...product,
          price: this.ensureEuros(product.price) // Ensure price is in euros
        };
      }

      return {
        ...product,
        affiliateLink: scrapingResult.validUrl,
        imageUrl: scrapingResult.imageUrl || product.imageUrl,
        price: scrapingResult.price || this.ensureEuros(product.price)
      };
    } catch (error) {
      console.warn('Error validating and enriching product:', error);
      return {
        ...product,
        price: this.ensureEuros(product.price) // Ensure price is in euros
      };
    }
  }
}

export const scrapingService = new ScrapingService();
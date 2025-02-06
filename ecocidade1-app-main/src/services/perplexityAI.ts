import axios from 'axios';
import { Product } from '../types';
import { scrapingService } from './scraping';

interface SearchResponse {
  suggestions: string[];
  analysis: {
    sustainabilityScore: number;
    environmentalImpact: string;
    recommendations: string[];
    products: Product[];
  };
}

const SEARCH_PROMPT = `
🎯 Objetivo: Identificar e comparar produtos ecológicos online para oferecer soluções sustentáveis, fiáveis e amigas do ambiente.

🔍 Metodologia:
1️⃣ Pesquisa e verificação
- Aceder a fontes fiáveis: sites especializados, estudos científicos, certificações ecológicas reconhecidas
- Verificar a relevância e autenticidade das informações recolhidas

2️⃣ Análise dos critérios ecológicos
- Avaliar o impacto ambiental (ciclo de vida, pegada de carbono, biodegradabilidade)
- Verificar certificações e rótulos ecológicos (ex.: Ecolabel, Fair Trade, GOTS)
- Estudar a durabilidade e os materiais utilizados

3️⃣ Comparação e recomendações
- Comparar os produtos segundo o seu desempenho ecológico e a relação qualidade/preço
- Identificar as melhores alternativas com base na inovação e no compromisso das marcas

4️⃣ Síntese otimizada
- Apresentar os resultados de forma clara e estruturada
- Facilitar a tomada de decisão com recomendações baseadas em critérios objetivos

Responda em português e forneça:
1. Lista de produtos encontrados com:
   - Nome
   - Descrição
   - Preço em Reais
   - Link direto para compra
   - Certificações ecológicas
   - Pontuação de sustentabilidade (0-10)
   - Impacto ambiental
2. Análise comparativa dos produtos
3. Recomendações específicas
4. Sugestões relacionadas à pesquisa
`;

const PARTNER_SITES = [
  'Decathlon Portugal',
  'Trotinetes Portugal',
  'BeElectric',
  'Automóveis Elétricos',
  'OOYOO',
  'Pegada Verde',
  'Mind in Trash'
];

class PerplexityAIService {
  private readonly apiKey: string;
  private readonly baseURL = 'https://api.perplexity.ai/chat/completions';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  }

  async searchProducts(query: string): Promise<SearchResponse> {
    try {
      if (!this.apiKey) {
        console.warn('Perplexity AI API key not configured, using mock data');
        return this.getMockSearchResponse(query);
      }

      const response = await this.retryRequest(async () => {
        return await axios.post(
          this.baseURL,
          {
            model: 'mixtral-8x7b-instruct',
            messages: [
              {
                role: 'system',
                content: `${SEARCH_PROMPT}\n\nFoco em produtos disponíveis em: ${PARTNER_SITES.join(', ')}\n
                Retorne apenas produtos com links diretos para compra e preços reais.
                Para cada produto, forneça:
                1. Nome completo
                2. Descrição detalhada
                3. Preço em Reais (R$)
                4. Link direto para compra
                5. Certificações ecológicas
                6. Pontuação de sustentabilidade (0-10)
                7. Impacto ambiental específico`
              },
              {
                role: 'user',
                content: `Pesquise produtos sustentáveis relacionados a: ${query}`
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      const searchResponse = await this.parseSearchResponse(response.data.choices[0].message.content);
      
      // Validate and enrich all products with scraping
      const enrichedProducts = await Promise.all(
        searchResponse.analysis.products.map(product => 
          scrapingService.validateAndEnrichProduct(product)
        )
      );

      // Filter out products with invalid links
      searchResponse.analysis.products = enrichedProducts.filter(
        product => product.affiliateLink && product.affiliateLink !== '#'
      );

      return searchResponse;
    } catch (error) {
      console.warn('Error searching products, using mock data:', error);
      return this.getMockSearchResponse(query);
    }
  }

  async getComparisonProducts(category?: string, userPreferences?: any): Promise<Product[]> {
    try {
      if (!this.apiKey) {
        console.warn('Perplexity AI API key not configured, using mock data');
        return this.getMockComparisonProducts();
      }

      const response = await axios.post(
        this.baseURL,
        {
          model: 'mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: `${SEARCH_PROMPT}\n\nFoco em produtos disponíveis em: ${PARTNER_SITES.join(', ')}`
            },
            {
              role: 'user',
              content: `Compare produtos sustentáveis ${category ? `na categoria ${category}` : ''} 
              considerando:
              1. Impacto ambiental
              2. Relação qualidade/preço
              3. Certificações ecológicas
              4. Durabilidade e materiais
              ${userPreferences ? `\nPreferências do usuário: ${JSON.stringify(userPreferences)}` : ''}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseComparisonProducts(response.data.choices[0].message.content);
    } catch (error) {
      console.warn('Error getting comparison products, using mock data:', error);
      return this.getMockComparisonProducts();
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      if (!this.apiKey) {
        console.warn('Perplexity AI API key not configured, using mock data');
        return this.getMockSuggestions();
      }

      const response = await axios.post(
        this.baseURL,
        {
          model: 'mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: `${SEARCH_PROMPT}\n\nGere 5 sugestões de pesquisa relacionadas em português.`
            },
            {
              role: 'user',
              content: `Sugira alternativas de pesquisa para: ${query}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseSuggestions(response.data.choices[0].message.content);
    } catch (error) {
      console.warn('Error getting suggestions:', error);
      return this.getMockSuggestions();
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      if (!this.apiKey) {
        console.warn('Perplexity AI API key not configured, using mock data');
        return this.getMockFeaturedProducts();
      }

      const response = await this.retryRequest(async () => {
        return await axios.post(
          this.baseURL,
          {
            model: 'mixtral-8x7b-instruct',
            messages: [
              {
                role: 'system',
                content: `${SEARCH_PROMPT}\n\nFoco em produtos disponíveis em: ${PARTNER_SITES.join(', ')}\n
                Retorne EXATAMENTE 6 produtos mais sustentáveis e populares.
                Para cada produto, forneça:
                1. Nome completo
                2. Descrição detalhada
                3. Preço em Reais (R$)
                4. Link direto para compra
                5. Certificações ecológicas
                6. Pontuação de sustentabilidade (0-10)
                7. Categoria específica
                8. Plataforma de venda`
              },
              {
                role: 'user',
                content: 'Liste os 6 produtos sustentáveis mais populares e bem avaliados atualmente.'
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      let products = await this.parseFeaturedProducts(response.data.choices[0].message.content);
      
      // Ensure exactly 6 products
      if (products.length < 6) {
        const mockProducts = this.getMockFeaturedProducts();
        products = [...products, ...mockProducts.slice(0, 6 - products.length)];
      } else if (products.length > 6) {
        products = products.slice(0, 6);
      }

      // Validate and enrich all products with scraping
      const enrichedProducts = await Promise.all(
        products.map(product => scrapingService.validateAndEnrichProduct(product))
      );

      // Filter out products with invalid links and ensure exactly 6 products
      const validProducts = enrichedProducts.filter(
        product => product.affiliateLink && product.affiliateLink !== '#'
      );

      if (validProducts.length < 6) {
        const mockProducts = this.getMockFeaturedProducts();
        return [...validProducts, ...mockProducts.slice(0, 6 - validProducts.length)];
      }

      return validProducts.slice(0, 6);
    } catch (error) {
      console.warn('Error fetching featured products, using mock data:', error);
      return this.getMockFeaturedProducts();
    }
  }

  private async retryRequest<T>(request: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
    
    throw lastError;
  }

  private parseSearchResponse(content: string): SearchResponse {
    try {
      // Extract products from the AI response
      const products: Product[] = [];
      const suggestions: string[] = [];
      let sustainabilityScore = 0;
      let environmentalImpact = '';
      let recommendations: string[] = [];

      // Parse the content using regex or string manipulation
      const lines = content.split('\n');
      let currentSection = '';

      for (const line of lines) {
        if (line.includes('Produtos encontrados:')) {
          currentSection = 'products';
          continue;
        } else if (line.includes('Sugestões relacionadas:')) {
          currentSection = 'suggestions';
          continue;
        } else if (line.includes('Análise de sustentabilidade:')) {
          currentSection = 'analysis';
          continue;
        } else if (line.includes('Recomendações:')) {
          currentSection = 'recommendations';
          continue;
        }

        // Parse based on current section
        switch (currentSection) {
          case 'products':
            // Extract product information
            const productMatch = line.match(/^- (.+?):\s*R\$\s*(\d+,?\d*)/);
            if (productMatch) {
              products.push({
                id: Math.random().toString(36).substr(2, 9),
                name: productMatch[1],
                description: '',
                price: parseFloat(productMatch[2].replace(',', '.')),
                category: '',
                imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                sustainabilityScore: 8,
                certifications: [],
                affiliateLink: '#',
                platform: PARTNER_SITES[Math.floor(Math.random() * PARTNER_SITES.length)]
              });
            }
            break;
          case 'suggestions':
            if (line.startsWith('-')) {
              suggestions.push(line.slice(2).trim());
            }
            break;
          case 'analysis':
            if (line.includes('Pontuação:')) {
              sustainabilityScore = parseInt(line.match(/\d+/)?.[0] || '0');
            } else if (line.includes('Impacto:')) {
              environmentalImpact = line.split(':')[1].trim();
            }
            break;
          case 'recommendations':
            if (line.startsWith('-')) {
              recommendations.push(line.slice(2).trim());
            }
            break;
        }
      }

      return {
        suggestions,
        analysis: {
          sustainabilityScore,
          environmentalImpact,
          recommendations,
          products
        }
      };
    } catch (error) {
      console.error('Error parsing search response:', error);
      return this.getMockSearchResponse('');
    }
  }

  private parseSuggestions(content: string): string[] {
    try {
      return content
        .split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.slice(2).trim())
        .filter(Boolean)
        .slice(0, 5);
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return this.getMockSuggestions();
    }
  }

  private parseComparisonProducts(content: string): Product[] {
    try {
      const products: Product[] = [];
      const lines = content.split('\n');
      let currentProduct: Partial<Product> = {};

      for (const line of lines) {
        if (line.startsWith('Produto:')) {
          if (Object.keys(currentProduct).length > 0) {
            products.push(currentProduct as Product);
          }
          currentProduct = {
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            platform: PARTNER_SITES[Math.floor(Math.random() * PARTNER_SITES.length)]
          };
          currentProduct.name = line.split(':')[1].trim();
        } else if (line.includes('Preço:')) {
          currentProduct.price = parseFloat(line.match(/R\$\s*(\d+,?\d*)/)?.[1].replace(',', '.') || '0');
        } else if (line.includes('Certificações:')) {
          currentProduct.certifications = line.split(':')[1].trim().split(',').map(cert => cert.trim());
        } else if (line.includes('Pontuação:')) {
          currentProduct.sustainabilityScore = parseInt(line.match(/\d+/)?.[0] || '0');
        } else if (line.includes('Descrição:')) {
          currentProduct.description = line.split(':')[1].trim();
        }
      }

      if (Object.keys(currentProduct).length > 0) {
        products.push(currentProduct as Product);
      }

      return products;
    } catch (error) {
      console.error('Error parsing comparison products:', error);
      return this.getMockComparisonProducts();
    }
  }

  private async parseFeaturedProducts(content: string): Promise<Product[]> {
    try {
      const products: Product[] = [];
      const lines = content.split('\n');
      let currentProduct: Partial<Product> = {};

      for (const line of lines) {
        if (line.match(/^\d+\.|^-\s*[A-Z]/)) {
          if (Object.keys(currentProduct).length > 0) {
            products.push(currentProduct as Product);
          }
          currentProduct = {
            id: Math.random().toString(36).substr(2, 9),
            platform: '',
            certifications: [],
            category: 'general',
            sustainabilityScore: 0
          };
        }

        const lineNormalized = line.toLowerCase().trim();

        if (line.includes('Nome:') || line.match(/^[A-Z].*:/)) {
          currentProduct.name = line.split(':')[1]?.trim();
        } else if (lineNormalized.includes('preço:') || line.includes('R$')) {
          const priceMatch = line.match(/R\$\s*(\d+[.,]?\d*)/);
          if (priceMatch) {
            currentProduct.price = parseFloat(priceMatch[1].replace(',', '.'));
          }
        } else if (lineNormalized.includes('link:') || line.includes('http')) {
          const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            currentProduct.affiliateLink = urlMatch[0];
          }
        } else if (lineNormalized.includes('descrição:')) {
          currentProduct.description = line.split(':')[1]?.trim();
        } else if (lineNormalized.includes('certificações:') || lineNormalized.includes('certificados:')) {
          currentProduct.certifications = line
            .split(':')[1]
            ?.trim()
            .split(',')
            .map(cert => cert.trim())
            .filter(Boolean);
        } else if (lineNormalized.includes('pontuação:') || lineNormalized.includes('score:')) {
          const scoreMatch = line.match(/\d+/);
          if (scoreMatch) {
            currentProduct.sustainabilityScore = parseInt(scoreMatch[0]);
          }
        } else if (lineNormalized.includes('categoria:')) {
          currentProduct.category = line.split(':')[1]?.trim().toLowerCase();
        } else if (lineNormalized.includes('plataforma:')) {
          currentProduct.platform = line.split(':')[1]?.trim();
        }
      }

      if (Object.keys(currentProduct).length > 0) {
        products.push(currentProduct as Product);
      }

      return products.map(product => ({
        ...product,
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        category: product.category || 'general',
        sustainabilityScore: product.sustainabilityScore || 8,
        certifications: product.certifications || [],
        platform: product.platform || PARTNER_SITES[Math.floor(Math.random() * PARTNER_SITES.length)]
      }));
    } catch (error) {
      console.error('Error parsing featured products:', error);
      return this.getMockFeaturedProducts();
    }
  }

  private getMockSuggestions(): string[] {
    return [
      'produtos de limpeza ecológicos',
      'lâmpadas LED eficientes',
      'painéis solares residenciais',
      'produtos orgânicos certificados',
      'eletrodomésticos eficientes'
    ];
  }

  private getMockSearchResponse(query: string): SearchResponse {
    return {
      suggestions: [
        `${query} ecológico`,
        `${query} sustentável`,
        `${query} biodegradável`,
        `${query} eco-friendly`,
        `${query} natural`
      ],
      analysis: {
        sustainabilityScore: 8.5,
        environmentalImpact: 'Impacto ambiental reduzido através de materiais sustentáveis',
        recommendations: [
          'Opte por produtos certificados',
          'Verifique a composição dos materiais',
          'Considere a durabilidade',
          'Avalie o processo de fabricação'
        ],
        products: this.getMockComparisonProducts()
      }
    };
  }

  private getMockComparisonProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Lâmpada LED Smart Eco',
        description: 'Lâmpada LED inteligente com controle de intensidade e economia de energia',
        price: 49.90,
        category: 'energy',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        sustainabilityScore: 9.5,
        certifications: ['Energia A+++', 'Smart Home', 'Baixo Consumo'],
        affiliateLink: '#',
        platform: 'BeElectric'
      },
      {
        id: '2',
        name: 'Filtro de Água Ecológico Premium',
        description: 'Sistema de filtração avançado com materiais biodegradáveis',
        price: 199.90,
        category: 'home',
        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        sustainabilityScore: 9.2,
        certifications: ['Zero Plástico', 'Filtração Natural', 'Material Reciclado'],
        affiliateLink: '#',
        platform: 'Pegada Verde'
      },
      {
        id: '3',
        name: 'Mochila Solar Aventura',
        description: 'Mochila com painel solar integrado e materiais reciclados',
        price: 159.90,
        category: 'accessories',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        sustainabilityScore: 8.8,
        certifications: ['Material Reciclado', 'Energia Solar', 'Durável'],
        affiliateLink: '#',
        platform: 'OOYOO'
      }
    ];
  }

  private getMockFeaturedProducts(): Product[] {
    return [
      {
        id: '4',
        name: 'Bicicleta Elétrica Urban Eco',
        description: 'Bicicleta elétrica com bateria de longa duração e design urbano',
        price: 2499.90,
        category: 'mobility',
        imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        sustainabilityScore: 9.8,
        certifications: ['Mobilidade Verde', 'Bateria Eco', 'Zero Emissões'],
        affiliateLink: '#',
        platform: 'BeElectric'
      },
      {
        id: '5',
        name: 'Kit Energia Solar Residencial',
        description: 'Sistema completo de energia solar para residências',
        price: 4999.90,
        category: 'energy',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        sustainabilityScore: 9.9,
        certifications: ['Energia Limpa', 'Alta Eficiência', 'Garantia Verde'],
        affiliateLink: '#',
        platform: 'Pegada Verde'
      },
      {
        id: '6',
        name: 'Composteira Automática Smart',
        description: 'Sistema de compostagem inteligente para residências',
        price: 899.90,
        category: 'home',
        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        sustainabilityScore: 9.6,
        certifications: ['Resíduo Zero', 'Smart Home', 'Eco Design'],
        affiliateLink: '#',
        platform: 'Mind in Trash'
      }
    ];
  }
}

export const perplexityAI = new PerplexityAIService();




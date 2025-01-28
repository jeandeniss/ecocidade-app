// Simulated product database with environmental impact data
export interface Product {
  id: string;
  name: string;
  category: string;
  environmentalImpact: {
    score: number; // 0-100, higher is better
    carbonFootprint: number; // in kg CO2
    recyclable: boolean;
    materials: string[];
    sustainabilityTips: string[];
  };
}

export const productDatabase: Record<string, Product> = {
  'plastic_bottle': {
    id: 'plastic_bottle',
    name: 'Plastic Water Bottle',
    category: 'Beverages',
    environmentalImpact: {
      score: 30,
      carbonFootprint: 0.08,
      recyclable: true,
      materials: ['PET Plastic'],
      sustainabilityTips: [
        'Consider using a reusable water bottle',
        'Ensure proper recycling',
      ],
    },
  },
  'paper_packaging': {
    id: 'paper_packaging',
    name: 'Paper Packaging',
    category: 'Packaging',
    environmentalImpact: {
      score: 70,
      carbonFootprint: 0.02,
      recyclable: true,
      materials: ['Recycled Paper', 'Biodegradable Materials'],
      sustainabilityTips: [
        'Compost if possible',
        'Reuse for other purposes before recycling',
      ],
    },
  },
};
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface EcoTip {
  category: string;
  tip: string;
  impact: string;
}

export const ecoTips: EcoTip[] = [
  {
    category: 'Energy',
    tip: 'Switch to LED bulbs',
    impact: 'Reduces energy consumption by up to 80% compared to traditional bulbs'
  },
  {
    category: 'Waste',
    tip: 'Start composting food scraps',
    impact: 'Reduces methane emissions from landfills and creates natural fertilizer'
  },
  {
    category: 'Water',
    tip: 'Install a water-saving showerhead',
    impact: 'Saves up to 2.5 gallons of water per minute'
  },
  {
    category: 'Transportation',
    tip: 'Use public transport or bike',
    impact: 'Reduces individual carbon footprint by up to 2.5 tons annually'
  }
];

export function generateResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('recycling') || input.includes('recycle')) {
    return 'Recycling is crucial for sustainability. Make sure to clean items before recycling and check local guidelines for acceptable materials.';
  }
  
  if (input.includes('energy') || input.includes('electricity')) {
    return 'To reduce energy consumption, consider using LED bulbs, unplugging devices when not in use, and using natural light when possible.';
  }
  
  if (input.includes('water')) {
    return 'Save water by fixing leaks, taking shorter showers, and collecting rainwater for plants.';
  }
  
  if (input.includes('plastic')) {
    return 'Reduce plastic use by carrying reusable bags, bottles, and containers. Avoid single-use plastics whenever possible.';
  }
  
  return 'How can I help you make more sustainable choices today? You can ask about recycling, energy saving, water conservation, or reducing plastic use.';
}
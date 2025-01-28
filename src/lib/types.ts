export interface EcoAction {
  id: string;
  userId: string;
  type: 'scan' | 'review' | 'visit' | 'purchase';
  points: number;
  description: string;
  timestamp: Date;
  environmentalImpact: {
    co2Saved: number;
    wastePrevented: number;
  };
}

export interface EcoReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'donation' | 'badge';
  value: number; // Percentage discount or donation amount
  storeId?: string; // For store-specific rewards
}

export interface WeeklySummary {
  weekStartDate: Date;
  totalPoints: number;
  actionsCount: number;
  environmentalImpact: {
    totalCo2Saved: number;
    totalWastePrevented: number;
  };
  topActions: EcoAction[];
  earnedRewards: EcoReward[];
}
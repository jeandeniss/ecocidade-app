"use client";

import { useState } from 'react';
import { EcoReward } from '@/lib/types';

const sampleRewards: EcoReward[] = [
  {
    id: '1',
    name: '10% Off Eco Products',
    description: 'Get 10% off on any eco-friendly product',
    pointsCost: 100,
    type: 'discount',
    value: 10,
  },
  {
    id: '2',
    name: 'Plant a Tree',
    description: 'We\'ll plant a tree on your behalf',
    pointsCost: 200,
    type: 'donation',
    value: 5,
  },
];

export default function EcoRewards() {
  const [userPoints, setUserPoints] = useState(150); // This would come from user data
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const claimReward = (reward: EcoReward) => {
    if (userPoints >= reward.pointsCost && !claimedRewards.includes(reward.id)) {
      setUserPoints(prev => prev - reward.pointsCost);
      setClaimedRewards(prev => [...prev, reward.id]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#2E8B57] p-4">
        <h2 className="text-white text-lg font-semibold">Eco Rewards</h2>
        <p className="text-white/80 text-sm">Your Points: {userPoints}</p>
      </div>

      <div className="p-4 space-y-4">
        {sampleRewards.map((reward) => (
          <div key={reward.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{reward.name}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <p className="text-sm font-medium mt-2">{reward.pointsCost} points</p>
              </div>
              <button
                onClick={() => claimReward(reward)}
                disabled={userPoints < reward.pointsCost || claimedRewards.includes(reward.id)}
                className="bg-[#2E8B57] text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {claimedRewards.includes(reward.id) ? 'Claimed' : 'Claim'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
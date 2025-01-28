"use client";

import { useState, useEffect } from 'react';
import { WeeklySummary as WeeklySummaryType } from '@/lib/types';

// Sample data - would come from API in production
const sampleSummary: WeeklySummaryType = {
  weekStartDate: new Date(),
  totalPoints: 450,
  actionsCount: 12,
  environmentalImpact: {
    totalCo2Saved: 25.5,
    totalWastePrevented: 3.2,
  },
  topActions: [],
  earnedRewards: [],
};

export default function WeeklySummary() {
  const [summary, setSummary] = useState<WeeklySummaryType>(sampleSummary);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#2E8B57] p-4">
        <h2 className="text-white text-lg font-semibold">Weekly Impact Summary</h2>
        <p className="text-white/80 text-sm">
          Week of {summary.weekStartDate.toLocaleDateString()}
        </p>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Points Earned</h3>
            <p className="text-2xl font-bold text-[#2E8B57]">{summary.totalPoints}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Actions Taken</h3>
            <p className="text-2xl font-bold text-[#2E8B57]">{summary.actionsCount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Environmental Impact</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="font-medium">{summary.environmentalImpact.totalCo2Saved} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Waste Prevented</p>
              <p className="font-medium">{summary.environmentalImpact.totalWastePrevented} kg</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
}
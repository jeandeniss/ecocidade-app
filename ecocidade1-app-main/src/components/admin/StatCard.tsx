import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className={`flex items-center ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
};
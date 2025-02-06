import React from 'react';
import { Line } from 'lucide-react';

interface RevenueChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Receita Mensal</h3>
      <div className="h-64 relative">
        {data.map((point, index) => {
          const height = ((point.value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div
              key={point.date}
              className="absolute bottom-0 bg-emerald-500 rounded-t-sm transition-all duration-300"
              style={{
                left: `${(index / (data.length - 1)) * 100}%`,
                height: `${height}%`,
                width: '2px'
              }}
              title={`${point.date}: R$ ${point.value.toFixed(2)}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        {data.map(point => (
          <span key={point.date}>{point.date}</span>
        ))}
      </div>
    </div>
  );
};
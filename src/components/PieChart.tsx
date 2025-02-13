import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  splits: { name: string; percentage: number }[];
  size?: 'small' | 'large';
}

export function PieChart({ splits, size = 'small' }: PieChartProps) {
  const data = {
    labels: splits.map(split => split.name),
    datasets: [
      {
        data: splits.map(split => split.percentage),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(16, 185, 129, 0.8)', // green-500
          'rgba(249, 115, 22, 0.8)', // orange-500
          'rgba(139, 92, 246, 0.8)', // purple-500
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: size === 'large',
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className={size === 'small' ? 'w-32 h-32' : 'w-48 h-48'}>
      <Pie data={data} options={options} />
    </div>
  );
} 
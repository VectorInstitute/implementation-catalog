"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MeaningfulnessChartProps {
  meaningful: number;
  notMeaningful: number;
}

export default function MeaningfulnessChart({ meaningful, notMeaningful }: MeaningfulnessChartProps) {
  const data = {
    labels: ['Meaningful', 'Not Meaningful'],
    datasets: [
      {
        data: [meaningful, notMeaningful],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 14,
          },
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = meaningful + notMeaningful;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Doughnut data={data} options={options} />;
}

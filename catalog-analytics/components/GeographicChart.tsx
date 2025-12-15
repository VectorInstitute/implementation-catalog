"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface GeographicData {
  country: string;
  count: number;
}

interface GeographicChartProps {
  data: GeographicData[];
}

export default function GeographicChart({ data }: GeographicChartProps) {
  const chartData = {
    labels: data.map(d => d.country),
    datasets: [
      {
        label: 'Forks',
        data: data.map(d => d.count),
        backgroundColor: '#8b5cf6',
        borderWidth: 0,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.x} forks`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

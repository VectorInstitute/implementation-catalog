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

interface CodeConfigChartProps {
  codeFiles: number;
  configFiles: number;
}

export default function CodeConfigChart({ codeFiles, configFiles }: CodeConfigChartProps) {
  const data = {
    labels: ['Code Files', 'Config Files'],
    datasets: [
      {
        label: 'Files Changed',
        data: [codeFiles, configFiles],
        backgroundColor: ['#667eea', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} files`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

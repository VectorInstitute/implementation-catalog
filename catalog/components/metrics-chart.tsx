"use client";

import { useMemo } from "react";

interface DataPoint {
  timestamp: string;
  value: number;
}

interface MetricsChartProps {
  data: DataPoint[];
  label: string;
  color?: string;
  height?: number;
}

export default function MetricsChart({
  data,
  label,
  color = "#06b6d4",
  height = 200,
}: MetricsChartProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (data.length === 0) {
      return { points: "", maxValue: 0, minValue: 0 };
    }

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const dataRange = max - min || 1;

    // Calculate SVG path points
    const width = 100; // Use percentage-based width
    const spacing = width / (data.length - 1 || 1);

    const pathPoints = data
      .map((point, index) => {
        const x = index * spacing;
        const y = height - ((point.value - min) / dataRange) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return {
      points: pathPoints,
      maxValue: max,
      minValue: min,
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || latestValue;
  const change = latestValue - previousValue;
  const changePercent =
    previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      {/* Current Value and Change */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {latestValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
        {data.length > 1 && (
          <div
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change.toLocaleString()} ({changePercent}%)
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1={height}
            x2="100"
            y2={height}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-gray-700"
          />
          <line
            x1="0"
            y1={height / 2}
            x2="100"
            y2={height / 2}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="2,2"
          />
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Area under the line */}
          <polygon
            points={`0,${height} ${points} 100,${height}`}
            fill={color}
            fillOpacity="0.1"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.split(" ").map((point, index) => {
            const [x, y] = point.split(",");
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="opacity-60"
              />
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute inset-y-0 -left-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>{maxValue.toLocaleString()}</div>
          <div>{minValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Timeline */}
      {data.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            {new Date(data[0].timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div>
            {new Date(data[data.length - 1].timestamp).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}

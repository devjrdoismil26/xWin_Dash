import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface BarChartProps {
  data: Array<Record<string, unknown>>;
  xAxisDataKey: string;
  barDataKey: string;
  title?: string;
  color?: string;
  height?: number;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey,
  barDataKey,
  title,
  color = '#8884d8',
  height = 300,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={barDataKey} fill={color} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;

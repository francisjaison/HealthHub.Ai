import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: { value: number }[];
  strokeColor?: string;
  fillColor?: string;
  height?: number;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ 
  data, 
  strokeColor = "#8884d8", // Default stroke color
  fillColor = "#8884d8",   // Default fill color
  height = 40 // Default height
}) => {
  if (!data || data.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`sparklineGradient-${fillColor.replace(/#/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={fillColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#sparklineGradient-${fillColor.replace(/#/g, '')})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart; 
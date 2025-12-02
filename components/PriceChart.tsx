import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StockHistoryItem } from '../types';

interface PriceChartProps {
  data: StockHistoryItem[];
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#3b82f6" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg text-slate-400">
        暂无历史数据图表
      </div>
    );
  }

  // Calculate domain based on 'close' price
  const prices = data.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Helper to format date for display (YYYY-MM-DD -> MM-DD)
  const formatDateTick = (dateStr: string) => {
    try {
        if (dateStr.length >= 10) {
            return dateStr.substring(5, 10);
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDateTick}
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toFixed(1)}
            width={40}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [value.toFixed(2), "收盘价"]}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
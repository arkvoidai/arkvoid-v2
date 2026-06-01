"use client"

import { useMemo } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface ChartPoint {
  date: string;
  value: number;
}

interface TrustScoreChartProps {
  data: ChartPoint[];
}

export function TrustScoreChart({ data }: TrustScoreChartProps) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      value: Number(d.value)
    }));
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] w-full text-[#3d3b45]">
        <BarChart2 size={24} className="mb-2" />
        <span className="text-xs">No trust data yet</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d96846" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#d96846" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#3d3b45', fontSize: 10 }}
            axisLine={false} 
            tickLine={false}
            tickFormatter={(v) => {
              try {
                return format(new Date(v), 'MMM d');
              } catch (e) {
                return v;
              }
            }}
          />
          <YAxis 
            domain={[0, 1]}
            tick={{ fill: '#3d3b45', fontSize: 10 }}
            axisLine={false} 
            tickLine={false}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
            labelStyle={{ color: '#6e6c76', fontSize: '11px', marginBottom: '4px' }}
            formatter={(value: number) => [value.toFixed(3), 'Trust Score']}
            labelFormatter={(label) => {
              try {
                return format(new Date(label), 'MMM d, yyyy');
              } catch (e) {
                return label;
              }
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#d96846" 
            strokeWidth={1.5}
            fill="url(#trustGrad)" 
            dot={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

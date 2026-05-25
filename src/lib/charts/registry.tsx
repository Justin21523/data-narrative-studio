import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

// Centralized registry for chart types and rendering logic
export type ChartType = 'recharts-line' | 'recharts-bar' | 'echarts-scatter' | 'echarts-heatmap';

export interface ChartDataPoint {
  [key: string]: string | number | boolean | null;
}

export interface ChartConfig {
  title?: string;
  type: ChartType;
  data: ChartDataPoint[];
  xAxisKey?: string;
  seriesKey?: string;
}

export function renderChart(config: ChartConfig): React.ReactNode {
  const { type, data, title, xAxisKey = 'timestamp', seriesKey = 'value' } = config;

  if (type === 'recharts-line' || type === 'recharts-bar') {
    const ChartComponent = type === 'recharts-line' ? LineChart : BarChart;
    const SeriesComponent = type === 'recharts-line' ? Line : Bar;

    const seriesKeys = Array.isArray(seriesKey) ? seriesKey : [seriesKey];

    return (
      <ResponsiveContainer width="100%" height={350}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
          <XAxis dataKey={xAxisKey} tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          {seriesKeys.map((key) => (
            <SeriesComponent
              key={key}
              type="monotone"
              dataKey={key}
              strokeWidth={type === 'recharts-line' ? 2 : undefined}
              fill={type === 'recharts-bar' ? 'hsl(var(--primary))' : undefined}
              stroke="hsl(var(--primary))"
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    );
  }

  if (type === 'echarts-scatter') {
    const defaultOption: EChartsOption = {
      title: { text: title, left: 'center' },
      tooltip: { trigger: 'item' },
      xAxis: { type: 'category', data: data.map((d: any) => d[xAxisKey]) },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
      series: [
        {
          type: 'scatter',
          data: data.map((d: any) => d[seriesKey as string]),
          symbolSize: 8,
          itemStyle: { color: 'hsl(var(--primary))' },
        },
      ],
    };

    return (
      <ReactECharts
        option={{ ...defaultOption } as EChartsOption}
        style={{ height: '350px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    );
  }

  return <div className="text-center py-8 text-destructive">Unsupported chart type: {type}</div>;
}
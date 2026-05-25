'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderChart, type ChartConfig } from '@/lib/charts/registry';

interface ChartBlockProps {
  id: string;
  config: ChartConfig;
}

export function ChartBlock({ id, config }: ChartBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      id={`block-${id}`}
      className="w-full max-w-4xl mx-auto my-10"
    >
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{config.title || 'Data Visualization'}</CardTitle>
        </CardHeader>
        <CardContent>{renderChart(config)}</CardContent>
      </Card>
    </motion.div>
  );
}
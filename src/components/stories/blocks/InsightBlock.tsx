'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightBlockProps {
  id: string;
  title: any;
  content: any;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'warning';
  delta?: number;
}

const STYLE_MAP: Record<string, { icon: React.ReactNode; badgeClass: string; border: string }> = {
  positive: { icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, badgeClass: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-500' },
  negative: { icon: <TrendingDown className="h-4 w-4 text-rose-500" />, badgeClass: 'bg-rose-100 text-rose-700', border: 'border-l-rose-500' },
  warning: { icon: <Lightbulb className="h-4 w-4 text-amber-500" />, badgeClass: 'bg-amber-100 text-amber-700', border: 'border-l-amber-500' },
  neutral: { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, badgeClass: 'bg-blue-100 text-blue-700', border: 'border-l-blue-500' },
};

export function InsightBlock({ id, title, content, sentiment = 'neutral', delta }: InsightBlockProps) {
  const style = STYLE_MAP[sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      id={`block-${id}`}
      className="w-full max-w-3xl mx-auto my-8"
    >
      <Card className={cn('border-l-4 bg-muted/20', style.border)}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {style.icon}
            <CardTitle className="text-base font-medium tracking-tight">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className={style.badgeClass}>{sentiment.toUpperCase()}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{content}</p>
          {delta !== undefined && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm font-medium">
              {delta > 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />}
              <span>{delta > 0 ? '+' : ''}{delta}% vs baseline period</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const THEMES = [
  {
    slug: 'youtube-trend-intelligence',
    title: 'YouTube Trend Intelligence',
    desc: 'Viral patterns, audience retention metrics, and algorithmic shift analysis.',
  },
  {
    slug: 'anime-fandom-analysis',
    title: 'Anime & Fandom Analysis',
    desc: 'Community engagement tracking, sentiment evolution, and cultural impact mapping.',
  },
  {
    slug: 'local-ai-benchmark',
    title: 'Local AI Benchmark',
    desc: 'Hardware performance profiling, model accuracy comparison, and inference latency tracking.',
  },
];

export default function HomePage() {
  return (
    <section className="space-y-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Data Narrative Studio</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          A narrative-driven platform that transforms complex datasets, model runs, and AI insights into structured, interactive stories.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme, index) => (
          <motion.div
            key={theme.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{theme.title}</CardTitle>
                <CardDescription>{theme.desc}</CardDescription>
                <Link href={`/themes/${theme.slug}`}>
                  <Button className="mt-4 w-full" variant="outline">
                    Explore Theme <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
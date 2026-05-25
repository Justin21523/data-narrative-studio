'use client';

import type { IStoryBlock } from '@/lib/db/models/story.model';
import { ChartBlock } from './blocks/ChartBlock';
import { InsightBlock } from './blocks/InsightBlock';
import { motion } from 'framer-motion';

interface StoryRendererProps {
  blocks: IStoryBlock[];
}

export function StoryRenderer({ blocks }: StoryRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <article className="space-y-16 py-12">
      {sortedBlocks.map((block) => {
        const key = `block-${block.id}`;
        switch (block.type) {
          case 'text':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                id={key}
                className="prose prose-slate dark:prose-invert max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold tracking-tight">{block.payload.title}</h2>
                <p className="text-muted-foreground mt-3 leading-7">{block.payload.content}</p>
              </motion.div>
            );
          case 'chart':
            return <ChartBlock key={key} id={block.id} config={block.payload} />;
          case 'insight':
            return <InsightBlock key={key} id={block.id} {...block.payload} />;
          default:
            return null;
        }
      })}
    </article>
  );
}
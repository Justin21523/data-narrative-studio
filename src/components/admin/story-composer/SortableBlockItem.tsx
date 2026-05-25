'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IStoryBlock } from '@/lib/db/models/story.model';

interface Props {
  block: IStoryBlock;
  onUpdate: (id: string, payload: Record<string, any>) => void;
  onRemove: (id: string) => void;
}

export function SortableBlockItem({ block, onUpdate, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const updatePayload = (key: string, value: any) => {
    onUpdate(block.id, { ...block.payload, [key]: value });
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="cursor-grab pt-2 text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {block.type} block
            </span>
            <button onClick={() => onRemove(block.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {block.type === 'text' && (
            <div className="grid gap-2">
              <Input placeholder="Section Title" value={block.payload.title || ''} onChange={(e) => updatePayload('title', e.target.value)} />
              <Textarea placeholder="Narrative content..." value={block.payload.content || ''} onChange={(e) => updatePayload('content', e.target.value)} className="min-h-[80px]" />
            </div>
          )}

          {block.type === 'chart' && (
            <div className="grid gap-2 sm:grid-cols-3">
              <Input placeholder="Chart Title" value={block.payload.title || ''} onChange={(e) => updatePayload('title', e.target.value)} />
              <Select value={block.payload.type} onValueChange={(v) => updatePayload('type', v)}>
                <SelectTrigger><SelectValue placeholder="Chart Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recharts-line">Line Chart</SelectItem>
                  <SelectItem value="recharts-bar">Bar Chart</SelectItem>
                  <SelectItem value="echarts-scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Data Collection Slug" value={block.payload.title || ''} onChange={(e) => updatePayload('datasetSlug', e.target.value)} />
            </div>
          )}

          {block.type === 'insight' && (
            <div className="grid gap-2">
              <Input placeholder="Insight Headline" value={block.payload.title || ''} onChange={(e) => updatePayload('title', e.target.value)} />
              <Textarea placeholder="AI-generated or manual insight..." value={block.payload.content || ''} onChange={(e) => updatePayload('content', e.target.value)} className="min-h-[60px]" />
              <Select value={block.payload.sentiment} onValueChange={(v) => updatePayload('sentiment', v)}>
                <SelectTrigger><SelectValue placeholder="Sentiment Tag" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
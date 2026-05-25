'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createOrUpdateStory } from '@/lib/server-actions/admin/stories';
import { SortableBlockList } from '@/components/admin/story-composer/SortableBlockList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, Eye } from 'lucide-react';
import type { IStoryBlock } from '@/lib/db/models/story.model';


const BLOCK_TYPES = [
  { value: 'text', label: 'Text Block' },
  { value: 'chart', label: 'Chart Block' },
  { value: 'insight', label: 'AI Insight Block' },
  { value: 'table', label: 'Dataset Table Block' },
];

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState<IStoryBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const autoSlug = (val: string) => val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleAddBlock = (type: string) => {
    const newBlock: IStoryBlock = {
      id: uuidv4(),
      type: type as IStoryBlock['type'],
      payload: type === 'text' ? { title: 'New Section', content: '' } 
               : type === 'chart' ? { title: 'Visualization', type: 'recharts-bar', data: [], xAxisKey: 'label', seriesKey: 'value' }
               : type === 'insight' ? { title: 'AI Finding', content: '', sentiment: 'neutral' }
               : { datasetSlug: '', title: 'Raw Data' },
      order: blocks.length,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleUpdateBlock = (id: string, payload: Record<string, any>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, payload } : b)));
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })));
  };

  const handleSave = async () => {
    if (blocks.length === 0) return alert('Add at least one block before saving.');
    setIsSaving(true);
    const result = await createOrUpdateStory({ title, slug, theme, description, status, blocks });
    setIsSaving(false);
    
    if (result.success) {
      alert('Story saved successfully.');
      router.push(`/admin/stories`);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create Data Story</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/explore')}>
            <Eye className="mr-2 h-4 w-4" /> Preview Public
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Publish / Save'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input id="title" value={title} onChange={(e: any) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }} placeholder="e.g., YouTube Trend Intelligence Q3" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" value={slug} onChange={(e: any) => setSlug(autoSlug(e.target.value))} placeholder="youtube-trend-intelligence-q3" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme Registry</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube-trend-intelligence">YouTube Trend Intelligence</SelectItem>
              <SelectItem value="anime-fandom-analysis">Anime & Fandom Analysis</SelectItem>
              <SelectItem value="local-ai-benchmark">Local AI Benchmark</SelectItem>
              <SelectItem value="game-review-sentiment">Game Review Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Publish Status</Label>
          <Select value={status} onValueChange={(v: any) => setStatus(v as 'draft' | 'published')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Description (SEO & Card Preview)</Label>
        <Textarea id="desc" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Brief summary for dashboard cards..." />
      </div>

      <div className="border rounded-lg p-6 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Narrative Blocks</h2>
          <div className="flex gap-2">
            {BLOCK_TYPES.map((bt) => (
              <Button key={bt.value} variant="secondary" size="sm" onClick={() => handleAddBlock(bt.value)}>
                <Plus className="mr-1 h-3 w-3" /> {bt.label}
              </Button>
            ))}
          </div>
        </div>
        <SortableBlockList blocks={blocks} onUpdate={handleUpdateBlock} onRemove={handleRemoveBlock} />
      </div>
    </div>
  );
}
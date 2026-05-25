import mongoose, { Schema, Document, Model } from 'mongoose';

export type StoryBlockType = 'text' | 'chart' | 'table' | 'insight' | 'media';

export type InsightSentiment = 'positive' | 'negative' | 'neutral' | 'warning';

export interface TextBlockPayload {
  title: string;
  content: string;
}

export interface ChartDataPoint {
  [key: string]: string | number | boolean | null;
}

export interface ChartBlockPayload {
  title?: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'recharts-bar';
  data: ChartDataPoint[];
  xAxisKey?: string;
  seriesKey?: string;
}

export interface InsightBlockPayload {
  title: string;
  content: string;
  sentiment?: InsightSentiment;
  delta?: number;
}

export interface TableBlockPayload {
  title: string;
  datasetSlug: string;
}

export interface MediaBlockPayload {
  url: string;
  caption?: string;
  alt?: string;
}

export interface BaseStoryBlock {
  id: string;
  order: number;
  meta?: Record<string, unknown>;
}
export interface TextStoryBlock extends BaseStoryBlock {
  type: 'text';
  payload: TextBlockPayload;
}

export interface ChartStoryBlock extends BaseStoryBlock {
  type: 'chart';
  payload: ChartBlockPayload;
}

export interface TableStoryBlock extends BaseStoryBlock {
  type: 'table';
  payload: TableBlockPayload;
}

export interface InsightStoryBlock extends BaseStoryBlock {
  type: 'insight';
  payload: InsightBlockPayload;
}

export interface MediaStoryBlock extends BaseStoryBlock {
  type: 'media';
  payload: MediaBlockPayload;
}

export type IStoryBlock =
  | TextStoryBlock
  | ChartStoryBlock
  | TableStoryBlock
  | InsightStoryBlock
  | MediaStoryBlock;

export interface IStory extends Document {
  slug: string;
  title: string;
  description?: string;
  theme: string;
  status: 'draft' | 'review' | 'published';
  blocks: IStoryBlock[];
  metadata?: { featured?: boolean; tags?: string[]; version?: number };
  createdAt: Date;
  updatedAt: Date;
}

const StoryBlockSchema = new Schema<IStoryBlock>({
  id: { type: String, required: true },
  type: { type: String, enum: ['text', 'chart', 'table', 'insight', 'media'], required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  order: { type: Number, required: true },
  meta: { type: Schema.Types.Mixed }
}, { _id: false });

const storySchema = new Schema<IStory>({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  theme: { type: String, required: true, index: true },
  status: { type: String, enum: ['draft', 'review', 'published'], default: 'draft' },
  blocks: { type: [StoryBlockSchema], required: true },
  metadata: {
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    version: { type: Number, default: 1 }
  }
}, { timestamps: true });

export const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>('Story', storySchema);
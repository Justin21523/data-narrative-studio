import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInsight extends Document {
  storySlug: string;
  datasetSlug: string;
  title: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'warning';
  confidenceScore: number;
  source: 'llm' | 'manual' | 'rule-based';
  createdAt: Date;
}

const insightSchema = new Schema<IInsight>({
  storySlug: { type: String, required: true, index: true },
  datasetSlug: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral', 'warning'], required: true },
  confidenceScore: { type: Number, default: 0.0, min: 0, max: 1 },
  source: { type: String, enum: ['llm', 'manual', 'rule-based'], default: 'llm' },
}, { timestamps: true });

export const Insight: Model<IInsight> = mongoose.models.Insight || mongoose.model<IInsight>('Insight', insightSchema);
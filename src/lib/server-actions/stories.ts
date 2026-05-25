'use server';

import { connectDB } from '@/lib/db/mongoose';
import { Story, type IStory } from '@/lib/db/models/story.model';
import { notFound } from 'next/navigation';

// Fetch published story by slug for Server Component rendering
export async function getPublishedStoryBySlug(slug: string): Promise<IStory> {
  await connectDB();
  const story = await Story.findOne({ slug, status: 'published' }).lean();
  if (!story) notFound();
  return JSON.parse(JSON.stringify(story)) as IStory;
}

// Fetch featured stories for dashboard grid
export async function getFeaturedStories(limit = 6): Promise<IStory[]> {
  await connectDB();
  const stories = await Story.find({ status: 'published' })
    .sort({ 'metadata.featured': -1, createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(stories)) as IStory[];
}
'use server';

import { connectDB } from '@/lib/db/mongoose';
import { Story } from '@/lib/db/models/story.model';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Validation schemas
const StoryMetaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens.'),
  description: z.string().optional(),
  theme: z.string().min(1, 'Theme is required.'),
});

const BlockSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'chart', 'insight', 'table']),
  payload: z.record(z.string(), z.any()),
  order: z.number(),
});

const StoryPayloadSchema = z.object({
  ...StoryMetaSchema.shape,
  status: z.enum(['draft', 'published']),
  blocks: z.array(BlockSchema).min(1, 'At least one content block is required.'),
});

export async function createOrUpdateStory(rawData: unknown) {
  try {
    const validated = StoryPayloadSchema.parse(rawData);
    await connectDB();

    const existing = await Story.findOne({ slug: validated.slug });
    
    if (existing) {
      // Update existing
      await Story.findByIdAndUpdate(existing._id, {
        title: validated.title,
        description: validated.description,
        theme: validated.theme,
        status: validated.status,
        blocks: validated.blocks,
        updatedAt: new Date(),
      });
    } else {
      // Create new
      await Story.create({
        slug: validated.slug,
        title: validated.title,
        description: validated.description,
        theme: validated.theme,
        status: validated.status,
        blocks: validated.blocks,
      });
    }

    // Revalidate public story page and dashboard
    revalidatePath('/explore');
    revalidatePath(`/stories/${validated.slug}`);
    
    return { success: true, slug: validated.slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error('Story save error:', error);
    return { success: false, error: 'Failed to save story. Please try again.' };
  }
}
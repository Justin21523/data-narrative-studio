import { getPublishedStoryBySlug } from '@/lib/server-actions/stories';
import { StoryRenderer } from '@/components/stories/StoryRenderer';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const story = await getPublishedStoryBySlug(params.slug);
    return {
      title: `${story.title} | Data Narrative Studio`,
      description: story.description,
    };
  } catch {
    return { title: 'Story Not Found | Data Narrative Studio' };
  }
}

export default async function StoryPage({ params }: Props) {
  const story = await getPublishedStoryBySlug(params.slug);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="mb-12 text-center border-b pb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs tracking-wide">
            {story.theme.toUpperCase()}
          </Badge>
          {story.metadata?.featured && (
            <Badge variant="default" className="bg-primary text-primary-foreground">FEATURED</Badge>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {story.title}
        </h1>
        {story.description && (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {story.description}
          </p>
        )}
      </header>

      <StoryRenderer blocks={story.blocks} />
    </div>
  );
}
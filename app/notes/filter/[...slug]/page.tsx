import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client'; 
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const currentFilter = resolvedParams.slug?.[0] || 'all';
  const capitalizedFilter = currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

  const title = `${capitalizedFilter} Notes | NoteHub`;
  const description = `View and manage all your notes categorized under the ${currentFilter} filter.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${currentFilter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${capitalizedFilter} Notes Preview`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  const slugArray = resolvedParams.slug;
  const currentTag = slugArray && slugArray[0] !== 'all' ? slugArray[0] : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', currentTag], 
    queryFn: () => fetchNotes({ page: 1, search: undefined, perPage: 12, tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
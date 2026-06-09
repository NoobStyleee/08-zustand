import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NoteDetails.client'; 
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const note = await fetchNoteById(resolvedParams.id);
    const title = `${note.title} | NoteHub`;
    const description = note.content.slice(0, 150) || 'Read full note details on NoteHub.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.com/notes/${resolvedParams.id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch {
    return { title: 'Note Details | NoteHub' };
  }
}

export default async function InterceptedNotePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const NotePreviewTyped = NotePreview as React.ComponentType<{ id: string }>;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewTyped id={id} />
    </HydrationBoundary>
  );
}
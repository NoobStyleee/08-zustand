import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NoteDetails.client'; 

interface PageProps {
  params: Promise<{ id: string }>;
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
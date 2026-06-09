import type { Metadata } from 'next';
import NoteForm from '../../../../components/NoteForm/NoteForm';
import css from './CreateNote.module.css'; 

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description: 'Write down your ideas, structure tasks, and save new records into NoteHub.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Write down your ideas, structure tasks, and save new records into NoteHub.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create Note Form Preview',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
import css from './not-found.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page not found</h1>
      <p>Sorry, we couldn’t find the page you’re looking for.</p>
      <Link href="/notes/filter/all">Go back to Notes</Link>
    </main>
  );
}

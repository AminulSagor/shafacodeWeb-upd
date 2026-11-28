import { notFound } from 'next/navigation';

/** Any unknown URL renders the branded 404 with HTTP status 404. */
export default function MissingPage() {
  notFound();
}

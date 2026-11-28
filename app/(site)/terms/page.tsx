import type { Metadata } from 'next';

import { LegalPage } from '@/components/site/legal/legal-page';
import { legalDocs } from '@/content/legal';
import { buildMetadata } from '@/lib/seo';

const doc = legalDocs['terms'];

export const metadata: Metadata = buildMetadata({
  title: `${doc.title} ${doc.accent}`,
  description: doc.description,
  path: '/terms',
});

export default function Page() {
  return <LegalPage doc={doc} />;
}

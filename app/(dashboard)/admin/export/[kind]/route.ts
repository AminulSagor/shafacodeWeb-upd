import { notFound } from 'next/navigation';

import { commissionFor } from '@/content/affiliate';
import { budgetLabel, projectTypeLabel, timelineLabel } from '@/lib/admin/format';
import { listApplications, listInquiries, listLeads } from '@/lib/admin/pipeline';
import { inquiryStatusLabel, leadStatusLabel, stageLabel } from '@/lib/admin/types';
import { requireAdmin } from '@/lib/auth';

/** Spreadsheet formulas must not run from client-supplied text. */
function cell(v: string | number | null | undefined) {
  const s = v === null || v === undefined ? '' : String(v);
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

const exports = {
  inquiries: async () => ({
    header: ['Received', 'Name', 'Email', 'Phone', 'Company', 'Project type', 'Budget', 'Timeline', 'Status', 'Source', 'Message'],
    rows: (await listInquiries()).map((i) => [
      i.createdAt, i.fullName, i.email, i.phone, i.company, projectTypeLabel(i.projectType), budgetLabel(i.budgetRange),
      timelineLabel(i.timeline), inquiryStatusLabel[i.status], i.source, i.message,
    ]),
  }),
  'affiliate-leads': async () => ({
    header: ['Received', 'Partner', 'Email', 'Phone', 'Partner type', 'Referred project', 'Est. value (BDT)', 'Commission low', 'Commission high', 'Status', 'Message'],
    rows: (await listLeads()).map((l) => {
      const c = l.estValue ? commissionFor(l.estValue) : null;
      return [l.createdAt, l.fullName, l.email, l.phone, l.partnerType, l.referredProject, l.estValue, c?.low ?? null, c?.high ?? null, leadStatusLabel[l.status], l.message];
    }),
  }),
  applications: async () => ({
    header: ['Applied', 'Name', 'Email', 'Phone', 'Location', 'Role', 'Experience', 'Stage', 'Portfolio', 'LinkedIn', 'GitHub'],
    rows: (await listApplications()).map((a) => [
      a.createdAt, a.fullName, a.email, a.phone, a.location, a.jobTitle, a.experienceRange, stageLabel[a.stage], a.portfolioUrl, a.linkedinUrl, a.githubUrl,
    ]),
  }),
} as const;

/** CSV download for the pipeline lists ("Export CSV" / "Export report"). */
export async function GET(_req: Request, { params }: { params: Promise<{ kind: string }> }) {
  await requireAdmin();
  const { kind } = await params;
  if (!(kind in exports)) notFound();
  const { header, rows } = await exports[kind as keyof typeof exports]();
  const csv = '﻿' + [header.map(cell).join(','), ...rows.map((r) => r.map(cell).join(','))].join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="shafacode-${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

import { budgetLabel, projectTypeLabel, timelineLabel } from '@/lib/admin/format';
import { listInquiries } from '@/lib/admin/pipeline';
import { requireAdmin } from '@/lib/auth';

/** Spreadsheet formulas must not run from client-supplied text. */
function cell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** CSV of every inquiry for the "Export report" button. */
export async function GET() {
  await requireAdmin();
  const rows = await listInquiries();
  const header = ['Received', 'Name', 'Email', 'Phone', 'Company', 'Project type', 'Budget', 'Timeline', 'Status', 'Source', 'Message'];
  const lines = rows.map((i) =>
    [i.createdAt, i.fullName, i.email, i.phone, i.company, projectTypeLabel(i.projectType), budgetLabel(i.budgetRange), timelineLabel(i.timeline), i.status, i.source, i.message]
      .map((v) => cell(v ?? ''))
      .join(',')
  );
  const csv = '﻿' + [header.map(cell).join(','), ...lines].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="shafacode-inquiries-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

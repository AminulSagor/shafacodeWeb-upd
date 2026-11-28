import 'server-only';

import nodemailer from 'nodemailer';

/** HTML-escape user input before it goes into an email body. */
export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strip CR/LF so user input cannot inject extra headers. */
export const headerSafe = (value: string) => value.replace(/[\r\n]+/g, ' ').trim().slice(0, 200);

type Row = { label: string; value?: string | null; href?: string };

/** Branded notification email (lime and graphite), plain-text fallback included. */
export function renderNotification(title: string, rows: Row[], footer = 'Sent from shafacode.com') {
  const body = rows
    .filter((r) => r.value)
    .map((r) => {
      const value = escapeHtml(r.value).replace(/\n/g, '<br/>');
      const safeHref = r.href && /^(https?:|mailto:)/i.test(r.href) ? r.href : null;
      const content = safeHref ? `<a href="${escapeHtml(safeHref)}" style="color:#4c6f00">${value}</a>` : value;
      return `<tr><td style="padding:8px 0;color:#6e7464;font:13px/20px Arial,sans-serif;width:160px;vertical-align:top">${escapeHtml(r.label)}</td><td style="padding:8px 0;color:#0d100f;font:15px/22px Arial,sans-serif">${content}</td></tr>`;
    })
    .join('');
  const html = `<div style="background:#f7f8f5;padding:24px"><div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e2e6db;border-radius:16px;overflow:hidden">
<div style="background:#0d100f;padding:20px 24px"><span style="color:#aef800;font:600 13px/16px monospace;letter-spacing:2px">[ SHAFACODE ]</span><h1 style="margin:8px 0 0;color:#f7f8f5;font:600 22px/28px Arial,sans-serif">${escapeHtml(title)}</h1></div>
<table style="width:100%;padding:16px 24px;border-collapse:collapse">${body}</table>
<p style="margin:0;padding:12px 24px 20px;color:#959c8b;font:12px/16px Arial,sans-serif">${escapeHtml(footer)}</p></div></div>`;
  const text = `${title}\n\n${rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`).join('\n')}\n\n${footer}`;
  return { html, text };
}

/** Sends a team notification; `to` defaults to TO_EMAIL (Site Settings passes its recipient). */
export async function sendMail(options: { subject: string; html: string; text: string; replyTo?: string; to?: string }) {
  if (!process.env.ZOHO_HOST || !process.env.ZOHO_USER || !process.env.ZOHO_PASS) {
    console.warn('Mail is not configured; skipping notification:', options.subject);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_HOST,
    port: Number(process.env.ZOHO_PORT) || 587,
    secure: Number(process.env.ZOHO_PORT) === 465,
    auth: { user: process.env.ZOHO_USER, pass: process.env.ZOHO_PASS },
  });
  await transporter.sendMail({
    from: process.env.ZOHO_USER,
    to: options.to || process.env.TO_EMAIL || process.env.ZOHO_USER,
    subject: headerSafe(options.subject),
    html: options.html,
    text: options.text,
    replyTo: options.replyTo ? headerSafe(options.replyTo) : undefined,
  });
}

/** An http(s) URL, or null (blocks javascript:, data: and other schemes). */
export function safeHttpUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null;
  } catch {
    return null;
  }
}

/** mailto: link for one plain address, or null when the value could inject headers. */
export function mailtoHref(email: string, subject?: string) {
  const e = email.trim();
  if (!/^[^\s@?&#,%<>"]+@[^\s@?&#,%<>"]+\.[^\s@?&#,%<>"]+$/.test(e)) return null;
  return `mailto:${e}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}

/** tel: link with digits and a leading plus only. */
export const telHref = (phone: string) => {
  const p = phone.replace(/[^\d+]/g, '');
  return p.replace(/\D/g, '').length >= 6 ? `tel:${p}` : null;
};

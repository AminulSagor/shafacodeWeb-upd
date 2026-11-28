import GithubSlugger from 'github-slugger';

/** Words of prose, code blocks excluded. */
export const wordCount = (markdown: string) =>
  markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;

/** H2 headings of a Markdown document with the same ids rehype-slug gives them. */
export function extractToc(markdown: string) {
  const slugger = new GithubSlugger();
  const items: { id: string; text: string }[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/(^|\W)[*_]+|[*_]+(?=\W|$)|`/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    const id = slugger.slug(text);
    if (m[1].length === 2) items.push({ id, text });
  }
  return items;
}

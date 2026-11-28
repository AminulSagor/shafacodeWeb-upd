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

/**
 * Markdown to HTML for structured data (JobPosting.description). Raw HTML in
 * the source is dropped, not passed through.
 */
export async function markdownToHtml(markdown: string) {
  const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkRehype }, { toHtml }] = await Promise.all([
    import('unified'),
    import('remark-parse'),
    import('remark-gfm'),
    import('remark-rehype'),
    import('hast-util-to-html'),
  ]);
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
  const tree = await processor.run(processor.parse(markdown));
  return toHtml(tree);
}

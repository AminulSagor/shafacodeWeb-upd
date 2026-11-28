import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/site/article/code-block';

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; data?: { meta?: string }; children?: HastNode[] };

/** Copies a fenced code block's `title="…"` meta onto the <pre> as data-title. */
function rehypeCodeTitle() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.tagName === 'pre') {
        const code = node.children?.find((c) => c.tagName === 'code');
        const title = code?.data?.meta?.match(/title="([^"]+)"/)?.[1];
        if (title) node.properties = { ...node.properties, dataTitle: title };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

const components: Components = {
  h1: ({ node: _node, ...p }) => <h2 className="mt-12 mb-4 type-h3 text-fg first:mt-0" {...p} />,
  h2: ({ node: _node, ...p }) => <h2 className="mt-12 mb-4 scroll-mt-[calc(var(--nav-height)+24px)] type-h3 text-fg first:mt-0" {...p} />,
  h3: ({ node: _node, ...p }) => <h3 className="mt-10 mb-3 scroll-mt-[calc(var(--nav-height)+24px)] type-h4 text-fg" {...p} />,
  h4: ({ node: _node, ...p }) => <h4 className="mt-8 mb-2 type-h5 text-fg" {...p} />,
  p: ({ node: _node, ...p }) => <p className="my-5 type-article text-fg-muted" {...p} />,
  a: ({ node: _node, href = '', ...p }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="rounded-sm text-fg-brand underline underline-offset-4 hover:text-fg-brand-hover focus-visible:focus-ring"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...p}
      />
    );
  },
  ul: ({ node: _node, ...p }) => <ul className="my-5 list-disc space-y-2 pl-6 type-article text-fg-muted marker:text-icon-brand" {...p} />,
  ol: ({ node: _node, ...p }) => <ol className="my-5 list-decimal space-y-2 pl-6 type-article text-fg-muted marker:text-fg-subtle" {...p} />,
  li: ({ node: _node, ...p }) => <li className="pl-1" {...p} />,
  strong: ({ node: _node, ...p }) => <strong className="font-semibold text-fg" {...p} />,
  em: ({ node: _node, ...p }) => <em className="italic" {...p} />,
  // Callout: an optional first **bold** paragraph becomes the mono label ("Key takeaway").
  blockquote: ({ node: _node, ...p }) => (
    <blockquote
      className="my-8 rounded-r-md border-l-2 border-action-primary bg-brand-soft px-5 py-4 [&>p]:my-0 [&>p]:type-body [&>p]:text-fg [&>p+p]:mt-2 [&>p:first-child>strong:only-child]:type-mono-xs [&>p:first-child>strong:only-child]:text-fg-brand"
      {...p}
    />
  ),
  hr: () => <hr className="my-10 border-line-subtle" />,
  code: ({ node: _node, className, ...p }) => (
    <code className={cn('rounded-xs bg-surface-2 px-1.5 py-0.5 type-mono-sm text-fg', className)} {...p} />
  ),
  pre: ({ node, children }) => {
    const title = (node?.properties as Record<string, unknown> | undefined)?.dataTitle;
    const lang = /language-(\w+)/.exec(String((node?.children?.[0] as { properties?: { className?: string[] } })?.properties?.className ?? ''))?.[1];
    return (
      <CodeBlock title={typeof title === 'string' ? title : undefined} language={lang}>
        {children}
      </CodeBlock>
    );
  },
  table: ({ node: _node, ...p }) => (
    <div className="my-6 overflow-x-auto rounded-md border border-line-subtle">
      <table className="w-full border-collapse type-body-sm" {...p} />
    </div>
  ),
  th: ({ node: _node, ...p }) => <th className="border-b border-line-subtle px-4 py-2.5 text-left type-label-sm text-fg" {...p} />,
  td: ({ node: _node, ...p }) => <td className="border-b border-line-subtle px-4 py-2.5 text-fg-muted" {...p} />,
  // CMS images are not optimised by next/image here; they keep their alt text.
  img: ({ node: _node, alt = '', ...p }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} loading="lazy" className="my-8 w-full rounded-md border border-line-subtle" {...p} />
  ),
};

/**
 * Markdown for posts, case studies, job descriptions and legal pages, styled
 * with the type utilities (replaces @tailwindcss/typography). Headings get
 * ids from rehype-slug for the table of contents.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeCodeTitle]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

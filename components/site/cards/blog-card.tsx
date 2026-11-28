import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { categoryLabel, type Post } from '@/content/blog';

export const postHref = (slug: string) => `/blogs/${slug}`;

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d);
};

export function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-1', className)}>
      <span className="type-mono-xs text-fg-subtle">{categoryLabel(post.category)}</span>
      <span className="type-caption text-fg-subtle">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
      </span>
    </p>
  );
}

export function AuthorChip({ author, size = 32 }: { author: Post['author']; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      {author.photo ? (
        <Image src={author.photo} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
      ) : (
        <span aria-hidden className="grid shrink-0 place-items-center rounded-full bg-surface-2 type-label-xs text-fg" style={{ width: size, height: size }}>
          {author.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </span>
      )}
      <span className="type-label-sm text-fg">{author.name}</span>
    </span>
  );
}

/**
 * Blog card (vertical) or featured post (horizontal). Stretched link on the
 * title; date is a <time>. Figma: Blog Card 17:2761
 */
export function BlogCard({
  post,
  horizontal = false,
  preload = false,
  headingLevel: H = 'h3',
}: {
  post: Post;
  horizontal?: boolean;
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <article
      className={cn(
        'group card-focus relative flex h-full flex-col overflow-hidden rounded-md border border-line-subtle bg-surface-1 transition-[border-color,translate] duration-(--duration-base) ease-out hover:border-line-brand motion-safe:hover:-translate-y-0.5',
        horizontal && 'xl:grid xl:grid-cols-[--spacing(144.75)_1fr]'
      )}
    >
      {post.cover && (
        <div className={cn('relative w-full overflow-hidden bg-surface-2', horizontal ? 'aspect-4/3 xl:aspect-auto xl:min-h-115' : 'h-media-card')}>
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            preload={preload}
            sizes={horizontal ? '(min-width: 1280px) 579px, 92vw' : '(min-width: 1280px) 395px, (min-width: 768px) 46vw, 92vw'}
            className="object-cover transition-transform duration-(--duration-slow) ease-out motion-safe:group-hover:scale-103"
          />
        </div>
      )}
      <div className={cn('flex flex-1 flex-col gap-3 p-card', horizontal && 'justify-center md:p-card-lg')}>
        <PostMeta post={post} />
        <H className={horizontal ? 'type-h3 text-fg' : 'type-h5 text-fg'}>
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </H>
        {post.excerpt && <p className="type-body-sm text-fg-muted">{post.excerpt}</p>}
        <div className={cn(horizontal ? 'mt-2' : 'mt-auto pt-3')}>
          <AuthorChip author={post.author} />
        </div>
      </div>
    </article>
  );
}

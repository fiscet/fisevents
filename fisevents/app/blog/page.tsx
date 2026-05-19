import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllPosts,
  getPublishedPosts,
  isPostPublished,
} from '@/lib/blog';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com';
const AUTHOR_NAME = 'Christian Zanchetta';
const AUTHOR_URL =
  'https://www.linkedin.com/in/christian-zanchetta-a7140621/?locale=en-US';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'How I built FisEvents · The series',
  description:
    'A twelve-part series on the decisions, trade-offs, and slow grind of building FisEvents — a multi-tenant event SaaS — over 22 months. What a CEO cares about, not what a junior dev wants to copy.',
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'How I built FisEvents · The series',
    description:
      'A twelve-part series on building a multi-tenant event SaaS over 22 months.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const publishedPosts = getPublishedPosts();
  const totalCount = allPosts.length;
  const publishedCount = publishedPosts.length;

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE_URL}/blog`,
    name: 'How I built FisEvents',
    description:
      'A twelve-part series on building a multi-tenant event SaaS — decisions, trade-offs, and the slow grind of solo product work.',
    url: `${BASE_URL}/blog`,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FisEvents',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/img/logo.png`,
      },
    },
    blogPost: publishedPosts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      url: `${BASE_URL}/blog/${p.slug}`,
      author: { '@type': 'Person', name: AUTHOR_NAME },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-8 text-center">
          <SectionHeader
            heading="How I built FisEvents"
            description="A twelve-part series on the decisions, trade-offs, and slow grind of building a multi-tenant event SaaS over 22 months. New posts every Monday and Thursday."
            align="center"
          />
          <p className="mt-4 text-sm text-fe-on-surface-variant">
            By{' '}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fe-primary hover:underline"
            >
              {AUTHOR_NAME}
            </a>
            <span className="mx-2 text-fe-outline-variant" aria-hidden="true">
              ·
            </span>
            <span>
              {publishedCount} of {totalCount} posts live
            </span>
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <ol className="flex flex-col gap-0">
            {allPosts.map(post => {
              const published = isPostPublished(post);
              const number = String(post.seriesOrder).padStart(2, '0');

              return (
                <li
                  key={post.slug}
                  className="group border-b border-fe-outline-variant/20 py-7 last:border-b-0 first:pt-0"
                >
                  <article
                    className={`flex gap-5 md:gap-7 ${
                      !published ? 'opacity-60' : ''
                    }`}
                  >
                    <div
                      className="flex-shrink-0 font-headline text-3xl md:text-4xl font-bold text-fe-primary/70 tabular-nums leading-none pt-1"
                      aria-hidden="true"
                    >
                      {number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs uppercase tracking-wider font-medium">
                        {published ? (
                          <>
                            <time
                              dateTime={post.publishedAt}
                              className="text-fe-on-surface-variant"
                            >
                              {formatDate(post.publishedAt)}
                            </time>
                            <span
                              className="inline-flex items-center gap-1.5 text-fe-primary"
                              aria-label="Published"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-fe-primary"
                                aria-hidden="true"
                              />
                              Live
                            </span>
                          </>
                        ) : (
                          <span className="text-fe-on-surface-variant">
                            Coming{' '}
                            <time dateTime={post.publishedAt}>
                              {formatDate(post.publishedAt)}
                            </time>
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-xl md:text-2xl font-headline font-bold text-fe-on-surface leading-snug">
                        {published ? (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-fe-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        ) : (
                          <span>{post.title}</span>
                        )}
                      </h2>
                      <p className="mt-2 text-sm md:text-base text-fe-on-surface-variant leading-relaxed">
                        {post.description}
                      </p>
                      {published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-block mt-3 text-sm font-semibold text-fe-primary hover:underline"
                        >
                          Read &rarr;
                        </Link>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}

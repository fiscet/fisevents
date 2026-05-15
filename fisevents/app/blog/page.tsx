import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/blog';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com';
const AUTHOR_NAME = 'Christian Zanchetta';
const AUTHOR_URL =
  'https://www.linkedin.com/in/christian-zanchetta-a7140621/?locale=en-US';
const SERIES_LENGTH = 11;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog · How I built FisEvents',
  description:
    'A series on the decisions, trade-offs, and slow grind of building FisEvents — a multi-tenant event SaaS — over 22 months. What a CEO cares about, not what a junior dev wants to copy.',
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog · How I built FisEvents',
    description:
      'A series on the decisions, trade-offs, and slow grind of building FisEvents over 22 months.',
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
  const posts = getPublishedPosts();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE_URL}/blog`,
    name: 'How I built FisEvents',
    description:
      'A series on building a multi-tenant event SaaS — decisions, trade-offs, and the slow grind of solo product work.',
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
    blogPost: posts.map(p => ({
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
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-8 text-center">
          <SectionHeader
            heading="How I built FisEvents"
            description="A series on the decisions, trade-offs, and slow grind of building a multi-tenant event SaaS over 22 months."
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
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          {posts.length === 0 ? (
            <p className="text-fe-on-surface-variant text-center">
              No posts published yet. Check back soon.
            </p>
          ) : (
            <ol className="flex flex-col gap-8">
              {posts.map(post => (
                <li
                  key={post.slug}
                  className="border-b border-fe-outline-variant/20 pb-8 last:border-b-0"
                >
                  <article>
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs uppercase tracking-wider text-fe-on-surface-variant font-medium"
                    >
                      {formatDate(post.publishedAt)}
                      {post.seriesOrder > 0 && (
                        <span className="ml-2 text-fe-primary">
                          · Part {post.seriesOrder} of {SERIES_LENGTH}
                        </span>
                      )}
                    </time>
                    <h2 className="mt-2 text-2xl md:text-3xl font-headline font-bold text-fe-on-surface">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-fe-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-fe-on-surface-variant leading-relaxed">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block mt-4 text-sm font-semibold text-fe-primary hover:underline"
                    >
                      Read &rarr;
                    </Link>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getAllPublishedSlugs,
  getPostBySlug,
  getPublishedPosts,
} from '@/lib/blog';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com';
const AUTHOR_NAME = 'Christian Zanchetta';
const AUTHOR_URL =
  'https://www.linkedin.com/in/christian-zanchetta-a7140621/?locale=en-US';
const SERIES_LENGTH = 11;

export const revalidate = 3600;
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllPublishedSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${BASE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} · FisEvents Blog`,
    description: post.description,
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [AUTHOR_NAME],
      section: 'Engineering',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getPublishedPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  // allPosts is sorted newest-first; "previous in series" is the next item
  const olderPost = allPosts[currentIndex + 1] ?? null;
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const articleUrl = `${BASE_URL}/blog/${post.slug}`;
  const ogImage = `${BASE_URL}/img/og-image.png`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: ogImage,
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BASE_URL}/blog`,
      name: 'How I built FisEvents',
    },
    ...(post.seriesOrder > 0 && { position: post.seriesOrder }),
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <article className="pb-24 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-fe-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-fe-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-fe-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-fe-on-surface truncate max-w-[200px] md:max-w-md">
                {post.title}
              </li>
            </ol>
          </nav>
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
          <h1 className="mt-2 text-3xl md:text-5xl font-headline font-bold text-fe-on-surface leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-fe-on-surface-variant leading-relaxed">
            {post.description}
          </p>
          <p className="mt-6 text-sm text-fe-on-surface-variant">
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
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-fe-on-surface prose-p:text-fe-on-surface prose-strong:text-fe-on-surface prose-a:text-fe-primary prose-li:text-fe-on-surface prose-code:text-fe-primary prose-blockquote:text-fe-on-surface-variant prose-blockquote:border-fe-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {(olderPost || newerPost) && (
          <nav
            aria-label="More posts"
            className="mt-16 pt-8 border-t border-fe-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {olderPost ? (
              <Link
                href={`/blog/${olderPost.slug}`}
                className="block rounded-2xl p-5 bg-fe-surface-container-low hover:bg-fe-surface-container transition-colors"
              >
                <span className="text-xs uppercase tracking-wider text-fe-on-surface-variant font-medium">
                  Previous
                </span>
                <span className="block mt-1 font-semibold text-fe-on-surface">
                  {olderPost.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {newerPost ? (
              <Link
                href={`/blog/${newerPost.slug}`}
                className="block rounded-2xl p-5 bg-fe-surface-container-low hover:bg-fe-surface-container transition-colors md:text-right"
              >
                <span className="text-xs uppercase tracking-wider text-fe-on-surface-variant font-medium">
                  Next
                </span>
                <span className="block mt-1 font-semibold text-fe-on-surface">
                  {newerPost.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </article>
  );
}

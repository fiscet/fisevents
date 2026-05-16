import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  seriesOrder: number;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'app', 'content', 'blog');

function readAllPosts(): BlogPost[] {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  return files.map(file => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const publishedAt =
      data.publishedAt instanceof Date
        ? data.publishedAt.toISOString().slice(0, 10)
        : String(data.publishedAt);

    return {
      slug: String(data.slug),
      title: String(data.title),
      description: String(data.description),
      publishedAt,
      seriesOrder: Number(data.seriesOrder ?? 0),
      content,
    };
  });
}

function isPublished(post: BlogPost, now = new Date()): boolean {
  const today = now.toISOString().slice(0, 10);
  return post.publishedAt <= today;
}

export function getPublishedPosts(): BlogPost[] {
  return readAllPosts()
    .filter(p => isPublished(p))
    .sort((a, b) =>
      a.publishedAt === b.publishedAt
        ? a.seriesOrder - b.seriesOrder
        : b.publishedAt.localeCompare(a.publishedAt)
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = readAllPosts().find(p => p.slug === slug);
  if (!post || !isPublished(post)) return null;
  return post;
}

export function getAllPublishedSlugs(): string[] {
  return getPublishedPosts().map(p => p.slug);
}

import postsData from "@/data/posts.json";
import { mockPosts } from "@/lib/mock-data";
import type { Post } from "@/lib/models";
import { generateTags } from "@/lib/tags";

type StoredPostLike = Partial<Post> & {
  messageId?: number;
  source?: "telegram" | string;
  links?: unknown[];
};

function getPostsArray(): StoredPostLike[] {
  const data = postsData as { posts?: StoredPostLike[] } | StoredPostLike[];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.posts)) return data.posts;
  return [];
}

function toPost(post: StoredPostLike): Post | null {
  if (!post.id || !post.title || !post.date) return null;

  const content = post.content || post.excerpt || post.title;
  const telegramId = post.telegramId || String(post.messageId || "");
  const telegramLink =
    post.telegramLink ||
    (post.messageId ? `https://t.me/psy_msutf/${post.messageId}` : undefined);

  return {
    id: String(post.id),
    title: String(post.title),
    excerpt: String(post.excerpt || content).slice(0, 260),
    content: String(content),
    category: String(post.category || "Текстовые публикации"),
    date: String(post.date),
    image: String(post.image || ""),
    tags:
      Array.isArray(post.tags) && post.tags.length > 0
        ? post.tags.map(String)
        : generateTags(String(`${post.title} ${content}`)),
    telegramId,
    telegramLink,
    createdAt: String(post.createdAt || post.date),
    updatedAt: String(post.updatedAt || post.createdAt || post.date),
  };
}

export function getSitePosts(): Post[] {
  const stored = getPostsArray().map(toPost).filter(Boolean) as Post[];
  const source = stored.length > 0 ? stored : mockPosts;

  return [...source].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSitePostById(id: string): Post | null {
  return getSitePosts().find((post) => post.id === id) || null;
}

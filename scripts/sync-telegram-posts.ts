import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchAllTelegramPosts } from "../lib/telegram";
import { normalizePosts } from "../lib/normalize";
import type { Post } from "../lib/models";

const channelName = getTelegramChannelName();
const maxPages = Number(process.env.TELEGRAM_MAX_PAGES || 30);
const dataDir = join(process.cwd(), "data");
const postsPath = join(dataDir, "posts.json");

interface PostsFile {
  posts: Post[];
}

type SyncPost = Post;

const CONTENT_KEYS: Array<keyof Omit<Post, "createdAt" | "updatedAt">> = [
  "id",
  "title",
  "excerpt",
  "content",
  "category",
  "date",
  "image",
  "tags",
  "telegramId",
  "telegramLink",
];

function getTelegramChannelName(): string {
  const fromName = process.env.TELEGRAM_CHANNEL_NAME?.trim();
  if (fromName) return fromName.replace(/^@/, "");

  const fromUrl = process.env.TELEGRAM_CHANNEL_URL?.trim();
  if (fromUrl) {
    const match = fromUrl.match(/t\.me\/(?:s\/)?([^/?#]+)/i);
    if (match?.[1]) return match[1].replace(/^@/, "");
  }

  return "psy_msutf";
}

function readExistingPosts(): Map<string, Post> {
  if (!existsSync(postsPath)) return new Map();

  try {
    const parsed = JSON.parse(readFileSync(postsPath, "utf8")) as Partial<PostsFile>;
    const posts = Array.isArray(parsed.posts) ? parsed.posts : [];
    return new Map(posts.filter((post) => post?.id).map((post) => [post.id, post]));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[telegram] Existing posts file could not be read cleanly: ${message}`);
    return new Map();
  }
}

function toPost(raw: Awaited<ReturnType<typeof fetchAllTelegramPosts>>[number]): Post {
  const now = new Date().toISOString();
  return {
    id: `tg-${raw.telegramId}`,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content,
    category: raw.rubric || "Текстовые публикации",
    date: raw.date,
    image: raw.image || "",
    tags: raw.tags || [],
    telegramId: raw.telegramId,
    telegramLink: raw.telegramLink,
    createdAt: now,
    updatedAt: now,
  };
}

function contentEquals(a: Post | undefined, b: SyncPost): boolean {
  if (!a) return false;

  return CONTENT_KEYS.every((key) => {
    const left = a[key];
    const right = b[key];
    return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
  });
}

function withStableMetadata(post: SyncPost, existing: Map<string, Post>, now: string): SyncPost {
  const oldPost = existing.get(post.id);

  if (contentEquals(oldPost, post)) {
    return {
      ...post,
      createdAt: oldPost?.createdAt || post.createdAt || now,
      updatedAt: oldPost?.updatedAt || post.updatedAt || now,
    };
  }

  return {
    ...post,
    createdAt: oldPost?.createdAt || post.createdAt || now,
    updatedAt: now,
  };
}

async function main() {
  const start = Date.now();
  const now = new Date().toISOString();
  console.log(`[telegram] Sync started: @${channelName}; maxPages=${maxPages}`);

  const existing = readExistingPosts();
  const raw = await fetchAllTelegramPosts(channelName, { maxPages });
  const modelPosts = raw.map(toPost);
  const normalized = normalizePosts(modelPosts);

  if (normalized.length === 0) {
    throw new Error("Telegram sync produced 0 posts. data/posts.json was not overwritten.");
  }

  const posts = normalized.map((post) =>
    withStableMetadata(
      {
        id: post.id,
        title: post.cleanTitle,
        excerpt: post.excerpt,
        content: post.contentClean,
        category: post.rubric || post.category || "Текстовые публикации",
        date: post.date,
        image: post.image || "",
        tags: post.tags,
        telegramId: post.telegramId,
        telegramLink: post.telegramLink,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      existing,
      now
    )
  );

  mkdirSync(dataDir, { recursive: true });
  writeFileSync(postsPath, JSON.stringify({ posts }, null, 2) + "\n", "utf8");

  const changed = posts.filter((post) => !contentEquals(existing.get(post.id), post)).length;
  const added = posts.filter((post) => !existing.has(post.id)).length;

  console.log(
    `[telegram] Sync complete: raw=${raw.length}, saved=${posts.length}, added=${added}, changed=${changed}, duration=${Date.now() - start}ms`
  );
}

main().catch((error) => {
  console.error("[telegram] Sync failed:", error);
  process.exit(1);
});

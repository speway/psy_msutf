import fs from "node:fs";
import path from "node:path";
import type {
  StoredPost,
  NormalizedPost,
  SyncResult,
  SyncDetail,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function log(
  level: "info" | "warn" | "error",
  message: string,
  ...args: unknown[]
) {
  const timestamp = new Date().toISOString();
  const prefix = "[telegram:save]";
  const fn =
    level === "info"
      ? console.log
      : level === "warn"
        ? console.warn
        : console.error;
  fn(`${timestamp} ${prefix} ${message}`, ...args);
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readExistingPosts(): StoredPost[] {
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const raw = fs.readFileSync(POSTS_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data as StoredPost[];
      if (data && Array.isArray(data.posts)) return data.posts as StoredPost[];
      log(
        "warn",
        "Unexpected posts.json format, expected array or {posts: array}"
      );
    }
  } catch (error) {
    log("warn", "Failed to read existing posts.json, starting fresh", error);
  }
  return [];
}

function normalizePostId(normalized: NormalizedPost): StoredPost {
  const now = new Date().toISOString();
  return {
    id: `tg-${normalized.messageId}`,
    messageId: normalized.messageId,
    title: normalized.title,
    excerpt: normalized.excerpt,
    content: normalized.content,
    date: normalized.date,
    dateOriginal: normalized.dateOriginal,
    image: normalized.image,
    links: normalized.links,
    source: "telegram",
    createdAt: now,
    updatedAt: now,
  };
}

export function savePosts(normalizedPosts: NormalizedPost[]): SyncResult {
  const startTime = Date.now();
  ensureDataDir();

  const existing = readExistingPosts();
  const existingMap = new Map<number, StoredPost>();

  for (const post of existing) {
    existingMap.set(post.messageId, post);
  }

  const details: SyncDetail[] = [];
  let added = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  const now = new Date().toISOString();

  for (const normalized of normalizedPosts) {
    try {
      const existingPost = existingMap.get(normalized.messageId);

      if (existingPost) {
        existingPost.title = normalized.title;
        existingPost.excerpt = normalized.excerpt;
        existingPost.content = normalized.content;
        existingPost.date = normalized.date;
        existingPost.dateOriginal = normalized.dateOriginal;
        existingPost.image = normalized.image;
        existingPost.links = normalized.links;
        existingPost.updatedAt = now;
        updated++;
        details.push({
          messageId: normalized.messageId,
          status: "updated",
          title: normalized.title,
        });
      } else {
        const stored = normalizePostId(normalized);
        existingMap.set(normalized.messageId, stored);
        added++;
        details.push({
          messageId: normalized.messageId,
          status: "added",
          title: normalized.title,
        });
      }
    } catch (error) {
      errors++;
      details.push({
        messageId: normalized.messageId,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const allPosts = Array.from(existingMap.values());
  allPosts.sort((a, b) => b.messageId - a.messageId);

  const outputData = { posts: allPosts };

  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(outputData, null, 2), "utf-8");
    log("info", `Saved ${allPosts.length} posts to ${POSTS_FILE}`);
  } catch (error) {
    log("error", "Failed to write posts.json", error);
    throw error;
  }

  const durationMs = Date.now() - startTime;
  skipped = existing.length - updated;

  log(
    "info",
    `Sync: +${added} added, ${updated} updated, ${skipped} skipped, ${errors} errors in ${durationMs}ms`
  );

  return {
    added,
    updated,
    skipped,
    errors,
    total: allPosts.length,
    durationMs,
    details,
  };
}

export function readStoredPosts(): StoredPost[] {
  return readExistingPosts();
}

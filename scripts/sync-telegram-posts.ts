import { writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fetchAllTelegramPosts } from "../lib/telegram";
import { normalizePosts } from "../lib/normalize";
import type { Post } from "../lib/models";

const channelName = process.env.TELEGRAM_CHANNEL_NAME || "psy_msutf";
const dataDir = join(process.cwd(), "data");
const postsPath = join(dataDir, "posts.json");

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

async function main() {
  const start = Date.now();
  console.log(`[telegram] Sync started: @${channelName}`);

  const raw = await fetchAllTelegramPosts(channelName, { maxPages: 30 });
  const modelPosts = raw.map(toPost);
  const normalized = normalizePosts(modelPosts);

  if (normalized.length === 0) {
    throw new Error("Telegram sync produced 0 posts. data/posts.json was not overwritten.");
  }

  mkdirSync(dataDir, { recursive: true });
  if (existsSync(postsPath)) {
    copyFileSync(postsPath, `${postsPath}.backup`);
  }

  const output = {
    posts: normalized.map((post) => ({
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
      updatedAt: new Date().toISOString(),
    })),
  };

  writeFileSync(postsPath, JSON.stringify(output, null, 2), "utf8");
  console.log(
    `[telegram] Sync complete: raw=${raw.length}, saved=${output.posts.length}, duration=${Date.now() - start}ms`
  );
}

main().catch((error) => {
  console.error("[telegram] Sync failed:", error);
  process.exit(1);
});

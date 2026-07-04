import { NextRequest, NextResponse } from "next/server";
import { fetchAllTelegramPosts } from "@/lib/telegram";
import { normalizePosts } from "@/lib/normalize";
import type { Post } from "@/lib/models";

const CHANNEL_NAME = process.env.TELEGRAM_CHANNEL_NAME || "psy_msutf";

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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret) {
    const provided = authHeader?.replace("Bearer ", "").trim() || querySecret || "";
    if (provided !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const raw = await fetchAllTelegramPosts(CHANNEL_NAME, { maxPages: 5 });
  const normalized = normalizePosts(raw.map(toPost));

  return NextResponse.json({
    success: true,
    mode: "preview-only",
    message:
      "Runtime sync is intentionally preview-only on Vercel. Use npm run sync:telegram or GitHub Action to update data/posts.json and trigger Vercel deploy.",
    channel: CHANNEL_NAME,
    raw: raw.length,
    normalized: normalized.length,
    posts: normalized.slice(0, 10).map((post) => ({
      id: post.id,
      title: post.cleanTitle,
      date: post.date,
      rubric: post.rubric,
    })),
  });
}

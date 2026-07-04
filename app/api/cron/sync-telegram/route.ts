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
    warning:
      "Vercel runtime filesystem is not used as persistent storage. Update data/posts.json through npm run sync:telegram or a GitHub Action commit.",
    channel: CHANNEL_NAME,
    raw: raw.length,
    normalized: normalized.length,
  });
}

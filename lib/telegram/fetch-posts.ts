import type { TelegramPost, TelegramFetchResult } from "./types";

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

function getConfig(): { botToken: string; channelId: string } {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID must be set in environment"
    );
  }

  return { botToken, channelId };
}

function log(
  level: "info" | "warn" | "error",
  message: string,
  ...args: unknown[]
) {
  const timestamp = new Date().toISOString();
  const prefix = "[telegram:fetch]";
  const fn =
    level === "info"
      ? console.log
      : level === "warn"
        ? console.warn
        : console.error;
  fn(`${timestamp} ${prefix} ${message}`, ...args);
}

function parseTelegramMessage(
  msg: Record<string, unknown>
): TelegramPost | null {
  const messageId = msg.message_id as number | undefined;
  if (!messageId) return null;

  const date = msg.date as number | undefined;
  if (!date) return null;

  const text = (msg.text as string) || (msg.caption as string) || "";
  const caption = (msg.caption as string) || "";

  const entities = (msg.entities as Array<Record<string, unknown>>) || [];
  const links: string[] = [];

  for (const entity of entities) {
    if (entity.type === "text_link" && entity.url) {
      links.push(entity.url as string);
    }
  }

  const hasMedia = !!(
    msg.photo ||
    msg.video ||
    msg.document ||
    msg.audio ||
    msg.voice
  );
  const mediaGroupId = msg.media_group_id as string | undefined;

  return {
    id: messageId,
    messageId,
    date: new Date((date as number) * 1000).toISOString(),
    text,
    caption,
    hasMedia,
    mediaGroupId,
    links,
  };
}

export async function fetchTelegramPosts(
  limit = 50,
  offset?: number
): Promise<TelegramFetchResult> {
  const { botToken, channelId } = getConfig();

  const url = `${TELEGRAM_API_BASE}${botToken}/getUpdates`;

  const params: Record<string, unknown> = {
    allowed_updates: ["message"],
    limit: Math.min(limit, 100),
  };

  if (offset !== undefined) {
    params.offset = offset;
  }

  log("info", `Fetching posts from channel ${channelId}`, { limit, offset });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Telegram API error: ${response.status} ${response.statusText} — ${text}`
    );
  }

  const data = (await response.json()) as {
    ok: boolean;
    result: Array<Record<string, unknown>>;
    description?: string;
  };

  if (!data.ok) {
    throw new Error(
      `Telegram API error: ${data.description || "Unknown error"}`
    );
  }

  const channelChatId = channelId.startsWith("-100")
    ? Number(channelId)
    : channelId.startsWith("-")
      ? Number(channelId)
      : channelId;

  const channelPosts: TelegramPost[] = [];

  for (const update of data.result) {
    const message = update.message as Record<string, unknown> | undefined;
    if (!message) continue;

    const chat = message.chat as Record<string, unknown> | undefined;
    if (!chat) continue;

    const chatId = chat.id as number;
    if (
      chatId !== Number(channelChatId) &&
      String(chatId) !== String(channelChatId)
    )
      continue;

    const post = parseTelegramMessage(message);
    if (post && post.text) {
      channelPosts.push(post);
    }
  }

  const lastUpdateId =
    data.result.length > 0
      ? (data.result[data.result.length - 1].update_id as number) + 1
      : null;

  log("info", `Fetched ${channelPosts.length} posts from channel`);

  return {
    posts: channelPosts,
    nextOffset: lastUpdateId,
    total: channelPosts.length,
  };
}

export async function fetchAllTelegramPosts(): Promise<TelegramPost[]> {
  const allPosts: TelegramPost[] = [];
  const seenMessageIds = new Set<number>();
  let offset: number | undefined;
  let emptyPages = 0;

  log("info", "Starting full fetch of all Telegram posts");

  while (emptyPages < 3) {
    const result = await fetchTelegramPosts(100, offset);

    const newPosts = result.posts.filter((p) => {
      if (seenMessageIds.has(p.messageId)) return false;
      seenMessageIds.add(p.messageId);
      return true;
    });

    allPosts.push(...newPosts);

    if (newPosts.length === 0) {
      emptyPages++;
    } else {
      emptyPages = 0;
    }

    if (!result.nextOffset) break;
    offset = result.nextOffset;
  }

  log("info", `Full fetch complete: ${allPosts.length} unique posts`);

  allPosts.sort((a, b) => b.messageId - a.messageId);

  return allPosts;
}

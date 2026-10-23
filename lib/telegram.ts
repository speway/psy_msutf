import { generateTags } from "./tags";
import { detectRubric } from "./rubric";
import { cleanTitle } from "./clean-title";

interface TelegramPostRaw {
  id: string;
  text: string;
  html: string;
  date: string;
  imageUrl: string | null;
  links: string[];
}

interface ParsedTelegramPost {
  telegramId: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  telegramLink: string;
  links: string[];
  rubric: string;
  tags: string[];
}

const TELEGRAM_WEB_BASE = "https://t.me/s";

interface FetchAllOptions {
  onPage?: (pagePosts: ParsedTelegramPost[], totalSoFar: number) => void;
  maxPages?: number;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      const message = error instanceof Error ? error.message : "Unknown error";
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[telegram] Attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms: ${message}`
        );
      }
      options?.onRetry?.(
        attempt,
        error instanceof Error ? error : new Error(String(error))
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Unreachable");
}

function log(
  level: "info" | "warn" | "error",
  message: string,
  ...args: unknown[]
) {
  if (process.env.NODE_ENV === "production" && level !== "error") return;
  const prefix = `[telegram]`;
  const timestamp = new Date().toISOString();
  switch (level) {
    case "info":
      console.log(`${timestamp} ${prefix} ${message}`, ...args);
      break;
    case "warn":
      console.warn(`${timestamp} ${prefix} ${message}`, ...args);
      break;
    case "error":
      console.error(`${timestamp} ${prefix} ${message}`, ...args);
      break;
  }
}

function extractBetween(text: string, start: string, end: string): string {
  const s = text.indexOf(start);
  if (s === -1) return "";
  const e = text.indexOf(end, s + start.length);
  if (e === -1) return "";
  return text.slice(s + start.length, e);
}

function extractImageUrl(block: string): string | null {
  const photoWrapMatch = block.match(
    /<a[^>]*class="[^"]*tgme_widget_message_photo_wrap[^"]*"[^>]*style="[^"]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/
  );
  if (photoWrapMatch) return photoWrapMatch[1];
  return null;
}

// Known custom emoji IDs mapped to their corresponding character/letter.
// Paid Telegram emoji packs often use custom letter fonts for headings.
const CUSTOM_EMOJI_LETTER_MAP: Record<string, string> = {
  "5400340875530230704": "П",
  "5400051562238209160": "Э",
  "5400192535916212177": "Э",
  "5402569194757708510": "В",
  "5400263690622627063": "В",
  "5400317304749714825": "Д",
};

// Russian word stems where an initial capital letter was replaced with a custom letter emoji
const RUSSIAN_STEM_LETTER_MAP: Array<[RegExp, string]> = [
  [/^сихолог/i, "П"],
  [/^кзамена/i, "Э"],
  [/^стреч/i, "В"],
  [/^ежавю/i, "Д"],
  [/^опрос/i, "В"],
  [/^абот/i, "Р"],
  [/^овост/i, "Н"],
  [/^аук/i, "Н"],
  [/^ероприяти/i, "М"],
  [/^екци/i, "Л"],
  [/^рактик/i, "П"],
  [/^овет/i, "С"],
  [/^тог/i, "И"],
  [/^нонс/i, "А"],
  [/^апис/i, "З"],
  [/^ниг/i, "К"],
  [/^тать/i, "С"],
  [/^сследован/i, "И"],
  [/^роект/i, "П"],
  [/^онкурс/i, "К"],
  [/^оздравл/i, "П"],
  [/^нимани/i, "В"],
  [/^ажн/i, "В"],
  [/^ассписани/i, "Р"],
  [/^арегистри/i, "З"],
  [/^сылк/i, "С"],
];

function decodeEmojiHex(hex: string): string {
  try {
    return Buffer.from(hex, "hex").toString("utf8");
  } catch {
    return "";
  }
}

function resolveTgEmojiTag(
  fullTag: string,
  emojiId: string | undefined,
  innerHtml: string,
  subsequentText: string
): string {
  // 1. Direct match in known custom emoji map
  if (emojiId && CUSTOM_EMOJI_LETTER_MAP[emojiId]) {
    return CUSTOM_EMOJI_LETTER_MAP[emojiId];
  }

  const cleanSub = subsequentText.replace(/<[^>]+>/g, "").trim();

  // 2. Check background image url for telegram emoji hex
  const hexMatch = innerHtml.match(
    /url\(['"]?(?:https?:)?\/\/telegram\.org\/img\/emoji\/\d+\/([0-9A-Fa-f]+)\.png['"]?\)/i
  );
  if (hexMatch) {
    const hex = hexMatch[1].toUpperCase();
    // F09F94A4 is Telegram's placeholder icon (🔤) for custom letter emoji packs
    if (hex === "F09F94A4") {
      for (const [pattern, letter] of RUSSIAN_STEM_LETTER_MAP) {
        if (pattern.test(cleanSub)) {
          return letter;
        }
      }
      return "";
    }
    const decoded = decodeEmojiHex(hex);
    if (decoded) return decoded;
  }

  // 3. Check inner text of <b> tag inside the emoji (if not fallback '?' or '??')
  const innerTextMatch = innerHtml.match(/<b>([\s\S]*?)<\/b>/i);
  const innerText = innerTextMatch ? innerTextMatch[1].trim() : "";
  if (innerText && innerText !== "??" && innerText !== "?" && innerText !== "🔤") {
    return innerText;
  }

  // 4. Fallback check for stem matching on subsequent clipped text
  for (const [pattern, letter] of RUSSIAN_STEM_LETTER_MAP) {
    if (pattern.test(cleanSub)) {
      return letter;
    }
  }

  return "";
}

function convertTelegramHtmlToMarkdown(html: string): string {
  let text = html;

  // 1. Replace <tg-emoji> tags with resolved characters/letters before any tag stripping
  text = text.replace(
    /<tg-emoji(?:\s+emoji-id="(\d+)")?[^>]*>([\s\S]*?)<\/tg-emoji>([\s\S]{0,60})/gi,
    (match, emojiId, innerHtml, subsequentText) => {
      const resolved = resolveTgEmojiTag(match, emojiId, innerHtml, subsequentText);
      return resolved + subsequentText;
    }
  );

  // 2. Replace standalone <i class="emoji"> tags (outside tg-emoji) with decoded Unicode
  text = text.replace(
    /<i[^>]*class="[^"]*emoji[^"]*"[^>]*style="[^"]*url\(['"]?(?:https?:)?\/\/telegram\.org\/img\/emoji\/\d+\/([0-9A-Fa-f]+)\.png['"]?\)[^"]*"[^>]*>([\s\S]*?)<\/i>/gi,
    (_, hex) => {
      const decoded = decodeEmojiHex(hex);
      return decoded || "";
    }
  );

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<b>\s*([\s\S]*?)\s*<\/b>/g, "**$1**");
  text = text.replace(/<i>\s*([\s\S]*?)\s*<\/i>/g, "*$1*");
  text = text.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g,
    (_, url, label) => `${label} (${url})`
  );
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // 3. Fuse split letters where bold/italic asterisks separated the initial letter from the word
  // e.g. "В***стреча" -> "Встреча", "***Д******ежавю***" -> "***Дежавю***"
  text = text.replace(/([А-Яа-яЁёA-Za-z])(?:\*|_)+([А-Яа-яЁёA-Za-z])/gu, "$1$2");
  text = text.replace(/([А-Яа-яЁёA-Za-z])(?:\*|_)+\s*(?:\*|_)+([А-Яа-яЁёA-Za-z])/gu, "$1$2");

  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

function extractLinks(html: string): string[] {
  const links: string[] = [];
  const regex = /<a[^>]*href=["']([^"']+)["'][^>]*>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (!url.startsWith("tg://") && !url.startsWith("tg:") && url !== "") {
      links.push(url);
    }
  }
  return [...new Set(links)];
}

function parseTelegramDate(dateAttr: string): string {
  try {
    const d = new Date(dateAttr);
    if (isNaN(d.getTime())) {
      const match = dateAttr.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function generateTitle(text: string): string {
  const lines = text.split("\n").filter(Boolean);
  if (lines.length === 0) return "Пост из Telegram";
  const firstLine = cleanTitle(lines[0]);
  if (firstLine.length <= 120) return firstLine;
  return firstLine.slice(0, 117) + "...";
}

function generateExcerpt(text: string, maxLength = 200): string {
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1");
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + "...";
}

function splitMessageBlocks(html: string): string[] {
  const blocks: string[] = [];
  const separator =
    '<div class="tgme_widget_message_wrap js-widget_message_wrap';
  let pos = 0;
  while (true) {
    const s = html.indexOf(separator, pos);
    if (s === -1) break;
    const blockEnd = html.indexOf(
      '<div class="tgme_widget_message_wrap js-widget_message_wrap',
      s + 1
    );
    const end = blockEnd === -1 ? html.length : blockEnd;
    blocks.push(html.slice(s, end));
    pos = end;
  }
  return blocks;
}

function parseMessageBlock(block: string): TelegramPostRaw | null {
  const dataPost = extractBetween(block, 'data-post="', '"');
  if (!dataPost) return null;

  const messageId = dataPost.split("/").pop() || dataPost;

  const textHtml = extractBetween(
    block,
    '<div class="tgme_widget_message_text js-message_text" dir="auto">',
    "</div>"
  );

  if (!textHtml) return null;

  const timeMatch = block.match(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/);
  const dateAttr = timeMatch ? timeMatch[1] : "";
  const date = parseTelegramDate(dateAttr);

  const imageUrl = extractImageUrl(block);

  const links = extractLinks(textHtml);

  const text = convertTelegramHtmlToMarkdown(textHtml);

  return { id: messageId, text, html: textHtml, date, imageUrl, links };
}

export async function fetchTelegramPosts(
  channelName: string,
  limit = 10
): Promise<ParsedTelegramPost[]> {
  const url = `${TELEGRAM_WEB_BASE}/${channelName}`;

  log("info", `Fetching recent posts from ${url}`);

  const response = await withRetry(
    async () => {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `Telegram fetch failed: ${res.status} ${res.statusText}`
        );
      }

      return res;
    },
    {
      maxRetries: 3,
      baseDelayMs: 2000,
    }
  );

  const html = await response.text();

  const blocks = splitMessageBlocks(html);
  log("info", `Parsed ${blocks.length} message blocks from ${url}`);

  const rawPosts: TelegramPostRaw[] = [];
  for (const block of blocks) {
    const parsed = parseMessageBlock(block);
    if (parsed && parsed.text.length > 0) {
      rawPosts.push(parsed);
    }
  }

  log("info", `Found ${rawPosts.length} raw posts (limit: ${limit})`);

  return rawPosts.slice(0, limit).map((raw) => {
    const rubric =
      detectRubric(raw.text) || (!raw.imageUrl ? "Текстовые публикации" : "");
    return {
      telegramId: raw.id,
      title: generateTitle(raw.text),
      excerpt: generateExcerpt(raw.text),
      content: raw.text,
      date: raw.date,
      image: raw.imageUrl || "",
      telegramLink: `https://t.me/${channelName}/${raw.id}`,
      links: raw.links,
      rubric,
      tags: generateTags(raw.text),
    };
  });
}

export async function fetchAllTelegramPosts(
  channelName: string,
  options?: FetchAllOptions
): Promise<ParsedTelegramPost[]> {
  const allPosts: ParsedTelegramPost[] = [];
  let beforeId: string | undefined;
  let pageCount = 0;
  const maxPages = options?.maxPages ?? 200;
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
  };
  let emptyPageCount = 0;
  const MAX_EMPTY_PAGES = 2;

  log(
    "info",
    `Starting full fetch for channel ${channelName} (max ${maxPages} pages)`
  );

  while (pageCount < maxPages && emptyPageCount < MAX_EMPTY_PAGES) {
    pageCount++;

    const url = beforeId
      ? `${TELEGRAM_WEB_BASE}/${channelName}?before=${beforeId}`
      : `${TELEGRAM_WEB_BASE}/${channelName}`;

    const response = await withRetry(
      async () => {
        const res = await fetch(url, { headers, next: { revalidate: 300 } });

        if (!res.ok) {
          throw new Error(
            `Telegram fetch failed at page ${pageCount}: ${res.status} ${res.statusText}`
          );
        }

        return res;
      },
      {
        maxRetries: 3,
        baseDelayMs: 2000,
        onRetry: (attempt, error) => {
          log("warn", `Page ${pageCount}, retry ${attempt}: ${error.message}`);
        },
      }
    );

    const html = await response.text();
    const blocks = splitMessageBlocks(html);

    const rawPosts: TelegramPostRaw[] = [];
    for (const block of blocks) {
      const parsed = parseMessageBlock(block);
      if (parsed && parsed.text.length > 0) {
        rawPosts.push(parsed);
      }
    }

    if (rawPosts.length === 0) {
      emptyPageCount++;
      log(
        "info",
        `Page ${pageCount} empty (${emptyPageCount}/${MAX_EMPTY_PAGES})`
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      continue;
    }

    emptyPageCount = 0;

    const parsedPosts = rawPosts.map((raw) => {
      const rubric =
        detectRubric(raw.text) || (!raw.imageUrl ? "Текстовые публикации" : "");
      return {
        telegramId: raw.id,
        title: generateTitle(raw.text),
        excerpt: generateExcerpt(raw.text),
        content: raw.text,
        date: raw.date,
        image: raw.imageUrl || "",
        telegramLink: `https://t.me/${channelName}/${raw.id}`,
        links: raw.links,
        rubric,
        tags: generateTags(raw.text),
      };
    });

    allPosts.push(...parsedPosts);
    log(
      "info",
      `Page ${pageCount}: +${parsedPosts.length} posts (total: ${allPosts.length})`
    );

    const ids = rawPosts
      .map((r) => parseInt(r.id, 10))
      .filter((n) => !isNaN(n));
    if (ids.length === 0) break;
    beforeId = String(Math.min(...ids));

    options?.onPage?.(parsedPosts, allPosts.length);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  log(
    "info",
    `Full fetch complete: ${allPosts.length} posts across ${pageCount} pages`
  );
  return allPosts;
}

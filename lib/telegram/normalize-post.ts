import type { TelegramPost, NormalizedPost } from "./types";

const EMOJI_PATTERN =
  /[\u{1F000}-\u{1FFFF}\u{200D}\u{FE0F}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

const MARKDOWN_PATTERN = /[*_~`](.*?)[*_~`]/g;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const URL_PATTERN = /https?:\/\/\S+/g;
const HASHTAG_PATTERN = /#\S+/g;
const REPEATING_WS = /\s{3,}/g;

const SYSTEM_MESSAGE_PATTERNS = [
  /^channel created$/i,
  /^channel photo updated$/i,
  /^user joined$/i,
  /^user left$/i,
];

function removeEmoji(text: string): string {
  return text.replace(EMOJI_PATTERN, "").trim();
}

function removeMarkdown(text: string): string {
  return text.replace(MARKDOWN_PATTERN, "$1").replace(HTML_TAG_PATTERN, "");
}

function removeUrls(text: string): string {
  return text.replace(URL_PATTERN, "").trim();
}

function removeHashtags(text: string): string {
  return text.replace(HASHTAG_PATTERN, "").trim();
}

function collapseWhitespace(text: string): string {
  return text.replace(REPEATING_WS, "\n\n").trim();
}

function isSystemMessage(text: string): boolean {
  const clean = text.trim().toLowerCase();
  return SYSTEM_MESSAGE_PATTERNS.some((p) => p.test(clean));
}

function cleanText(text: string): string {
  let result = text;
  result = removeEmoji(result);
  result = removeMarkdown(result);
  result = removeUrls(result);
  result = removeHashtags(result);
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&lt;/g, "<");
  result = result.replace(/&gt;/g, ">");
  result = result.replace(/&quot;/g, '"');
  result = result.replace(/&#39;/g, "'");
  result = result.replace(/\uFFFD/g, "");
  result = collapseWhitespace(result);
  return result;
}

function extractLinks(text: string): string[] {
  const links: string[] = [];
  const regex = /https?:\/\/\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const url = match[0].replace(/[.,;!?)]+$/, "");
    if (url.length > 5) {
      links.push(url);
    }
  }
  return [...new Set(links)];
}

function generateTitle(text: string): string {
  const cleaned = cleanText(text);
  const lines = cleaned.split("\n").filter(Boolean);
  if (lines.length === 0) return "Пост из Telegram";

  const firstLine = lines[0];
  if (firstLine.length <= 100) return firstLine;
  return firstLine.slice(0, 97) + "...";
}

function generateExcerpt(text: string, maxLength = 250): string {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + "...";
}

export function normalizePost(post: TelegramPost): NormalizedPost | null {
  if (isSystemMessage(post.text)) return null;

  const cleaned = cleanText(post.text);
  if (!cleaned || cleaned.length < 20) return null;

  const title = generateTitle(post.text);
  const excerpt = generateExcerpt(post.text);
  const dateOriginal = post.date;
  const date = post.date.split("T")[0];
  const links = extractLinks(post.text);
  const image = post.hasMedia ? `${post.messageId}` : "";

  return {
    messageId: post.messageId,
    title,
    excerpt,
    content: cleaned,
    date,
    dateOriginal,
    image,
    links,
    hasMedia: post.hasMedia,
  };
}

export function deduplicatePosts(posts: NormalizedPost[]): NormalizedPost[] {
  const seen = new Set<number>();
  const seenTitles = new Set<string>();

  return posts.filter((post) => {
    if (seen.has(post.messageId)) return false;
    seen.add(post.messageId);

    const titleKey = post.title.toLowerCase().trim();
    if (titleKey.length > 10 && seenTitles.has(titleKey)) return false;
    if (titleKey.length > 10) seenTitles.add(titleKey);

    return true;
  });
}

export function normalizePosts(posts: TelegramPost[]): NormalizedPost[] {
  const normalized: NormalizedPost[] = [];

  for (const post of posts) {
    const n = normalizePost(post);
    if (n) normalized.push(n);
  }

  return deduplicatePosts(normalized);
}

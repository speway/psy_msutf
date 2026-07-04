import type { Post } from "./models";
import { getPostRubric, getManualPostRubric } from "./rubric";

const SYSTEM_KEYWORDS = [
  "channel created",
  "channel photo updated",
  "user joined",
];

const SYSTEM_PATTERNS = [/^channel created$/i, /^channel photo updated$/i];

const URL_PATTERN = /https?:\/\/\S+/g;
const MARKDOWN_BOLDITALIC = /\*\*\*(.*?)\*\*\*/g;
const MARKDOWN_BOLD = /\*\*(.*?)\*\*/g;
const MARKDOWN_ITALIC = /\*(.*?)\*/g;
const MARKDOWN_CODE = /`([^`]+)`/g;
const MARKDOWN_UNDERSCORE = /__(.*?)__/g;
const MARKDOWN_STRIKETHROUGH = /~~(.*?)~~/g;
const HTML_TAG = /<[^>]*>/g;

const DECORATIVE_SEPARATORS =
  /[〰️▫️✨⭐️⏰➡️〰〰🎗🎗💡💡🌬🌬🤩🏛📒📍⏺️☹️❄️👀🚩‼️🆕🌞🟡🔵🟣⚪️❤️🩶🖊️☀️🐌🐰⛓💙🩷💚💜🧡💛💬🗒🗣🔘🔜🔛🔚🔙😊😁😂🤣😍🥰😘😗😚😋😛😜🤪😝🤑🤗🤭🤫🤔🤐🤨😐😑😶😏😒🙄😬😮😯😰😱😲😳🤯😵😡🤬😠😤😈👿💀☠️❣️💕💞💓💗💖💘💝💟👍👎👊✊🤛🤜🤞✌️🤟👌🤌🤏👈👉👆👇☝️✋🤚🖐🖖👋🤙💪🦵🦶🖕👏🙌👐🤲🤝🙏✍️💅🤳💃🕺👯‍♀️👯‍♂️🕴👫👬👭💏💑👪🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀️🌝🌞⭐🌟🌠☁️⛅⚡❄️🔥💧🌊🌈☔☂️❄️💥✨🌟⭐️🌤🌥🌦🌧🌨🌩🌪🌫🌬🌀🎉🎊🎈🎁🎀🪄🔮🕹💻🖥⌨️🖱🖨🖲📷📸📹🎥📽🎬📺📻🎙🎚🎛🧭⏱⏲⏰🕰⌚️📡🔋🔌💡🔦🕯🧯🛢💸💵💴💶💷🪙💰💳💎⚖️🧰🔧🔨🔩🔫💣🧬🩸🩹🩺💉💊🩻🔬🔭📡💻🖥🖨⌨️🖱️🖲️🕹️🗄️🗃️📁📂🗂️📅📆🗓️📇📈📉📊📋📌📍📎🖇️📏📐✂️🔒🔓🔏🔐🔑🗝️🔨🔧🔩🔗⛓️🧱🧲🔫💣🧬🩸🩹🩺💉💊🩻🛠️⚒️⛏️⚙️🧰🧪🧫🧬🔬🔭🌡️🧹🪠🧺🧻🪣🪥🧴🪒🪮🧵🪡🧶🪢🩱🩲🩳👙👗👘👚👛👜👝🛍️🎒👞👟🥾🥿👠👡👢👑👒🎩🎓🧢⛑️💄💋👣👀👁️👁‍🗨🧠🫀🫁🦷🦴👅👂🦻👃👋🤚🖐✋🖖👌🤌🤏✌️🤞🫰🫵🫶👈👉👆🫵👇☝️✊👊🤛🤜👏🙌👐🤲🤝🙏✍️💅🤳💪🦵🦶👂🦻👃🧠🫀🫁🦷🦴👅👁👁‍🗨👀🐶🐱🐭🐹🐰🦊🐻🐼🐻‍❄️🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🪱🐛🦋🐌🐞🐜🪰🪲🪳🦟🦗🕷🕸🦂🐢🐍🦎🦖🦕🐙🦑🪼🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🐊🐅🐆🦓🦍🦧🐘🦛🦏🐪🐫🦒🦘🦬🐃🐂🐄🐎🐖🐏🐑🦙🐐🦌🐕🐩🦮🐕‍🦺🐈🐈‍⬛🪶🐓🦃🦤🦚🦜🦢🦩🕊🐇🦝🦨🦡🦫🦦🦥🐁🐀🐿🦔🐾🐉🐲🌵🎄🌲🌳🌴🌱🌿☘️🍀🎍🎋🍃🍂🍁🪺🪹🍄🐚🪸🪷🌸💮🏵️🌹🥀🌺🌻🌼🌷🌷🪻🌱🪴🌲🌳🌴🌵🌾🌿☘️🍀🍁🍂🍃🪺🪹🪸🪷🌺🌻🌼🌷🌷🪻🍄🥜🌰🫘🫑🥬🥦🥒🌶🫑🌽🥕🫒🧄🧅🥔🍠🫐🥝🍅🫒🥥🥑🍆🥔🥕🌽🌶🫑🥬🥦🥒🧄🧅🍄🥜🌰🍞🥖🥨🧀🥚🍳🧈🥞🧇🥓🥩🍗🍖🦴🌭🍔🍟🍕🫓🥪🥙🧆🌮🌯🫔🥗🥘🫕🥫🍝🍜🍲🍛🍣🍱🥟🦪🍤🍙🍚🍘🍥🥠🥮🍢🍡🍧🍨🍦🥧🧁🍰🎂🍮🍭🍬🍫🍿🍩🍪🌰🥜🍯🥛☕🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🫗🧃🧉🧊🥤🧋🫖🍽🍴🥄🧂🗡🔪🪣🏺🌍🌎🌏🌐🗺🧭🏔⛰🌋🗻🏕🏖🏜🏝🏞🏟🏛🏗🛖🏘🏚🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🕌🛕🕍⛩🕋⛲⛺🌁🌃🏙🌄🌅🌆🌇🌉♨️🎠🛝🎡🎢💈🎪🎭🎨🎰🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚐🚑🚒🚓🚔🚕🚖🚗🚘🚙🛻🚚🚛🚜🏎🏍🛵🛺🛴🚲🛹🛼🚏🛣🛤🛢⛽🛞🚨🚥🚦🛑🚧⚓🛟⛵🛶🚤🛳⛴🛥🚢✈🛩🛫🛬🪂💺🚁🚟🚠🚡🛰🚀🛸🪐🌠🌌🏁🚩🎌🏴🏳🏳‍🌈🏳‍⚧🏴‍☠️🪅🪆🧩♟🎯🎱🎳🎮🕹🎲🧸🪀🪁🪩🪪🃏🀄🎴🔮🪄🎭🖼🎨🧵🪡🧶🪢🧵🪡🪢🪣🪥🧴🪒🪮🧹🪠🧺🧻🪣🧴🧹🪠🧺🧻🪣🪴🪐🪐🪐🪐🪐🪐🪐🪐]+/gu;

const HASHTAG_PATTERN = /#\S+/g;
const QUERY_PARAM_PATTERN = /\?q=[^\s]*/g;
const ZOOM_PATTERN = /zoom\.us\/\S+/gi;
const TELEGRAM_LINK_PATTERN = /t\.me\/\S+/gi;
const FORMS_PATTERN = /forms\.gle\/\S+|docs\.google\.com\/forms\/\S+/gi;

const DATE_PATTERN =
  /\b\d{1,2}\s+(январ[ья]|феврал[ья]|март[а]?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|август[а]?|сентябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])\s+\d{4}\s+года?\b/gi;

const TIME_PATTERN =
  /\bвремя:\s*\d{1,2}:\d{2}\b|\b\d{1,2}:\d{2}\s*(?:по\s*(?:москве|ташкент))/gi;

const REPEATING_CHARS = /(.)\1{4,}/g;

const TRIM_PATTERN = /^[\s,;:.!?\-—]+|[\s,;:.!?\-—]+$/g;

const HYPHEN_NORMALIZE = /\b([А-Яа-я]+)-это\b/giu;

const PARENS_URL_PATTERN = /\((https?:\/\/\S+)\)/g;

const REPOST_PATTERN = /^\[(?:forwarded|переслано|reposted).*?\]/i;
const REPOST_KEYWORDS = /\b(?:forwarded|переслано|reposted)\b/i;

const EMOJI_ALL =
  /[\u{1F000}-\u{1FFFF}\u{200D}\u{FE0F}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

const TAG_BLACKLIST = new Set([
  "психология",
  "исследования",
  "мероприятие",
  "учеба",
  "наука",
  "образование",
  "студенты",
  "мгу",
  "филиал",
  "ташкент",
  "анонс",
  "итоги",
  "возможности",
  "событие",
  "новости",
]);

const TITLE_OVERRIDES: Record<string, string> = {
  "tg-79": "Тип личности: понять себя, а не повесить ярлык",
  "tg-57": "Открыта регистрация на Международную конференцию «Ломоносов-2026»",
  "tg-100":
    "Уважаемые участники Международной конференции «Ломоносов» по Психологии",
  "tg-49":
    "Приглашаем на VI Международный психологический форум «Ребенок в цифровом мире»",
  "tg-94": "Ломоносов-2026 в Ташкенте!",
};

const LABEL_PATTERNS = [
  /\bдата:\s*/gi,
  /\bвремя:\s*/gi,
  /\bформат:\s*/gi,
  /\bссылка:\s*/gi,
  /\bрегистрация:\s*/gi,
  /\bzoom:\s*/gi,
  /\bzoom\b\s*/gi,
  /\bтема:\s*/gi,
  /\bлектор:\s*/gi,
  /\bместо:\s*/gi,
  /\bадрес:\s*/gi,
  /\bкогда:\s*/gi,
  /\bгде:\s*/gi,
  /\bстоимость:\s*/gi,
  /\bцена:\s*/gi,
  /\bдедлайн:\s*/gi,
  /\bорганизатор:\s*/gi,
  /\bподробнее:\s*/gi,
  /\bучастие:\s*/gi,
  /\bотбор:\s*/gi,
];

const EMPTY_CONTENT_PATTERNS = [
  /^[\s\-—–_〰️▫️✨⭐️⏰➡️🌟🎗️💡🌬🤩🏛📒📍☹️❄️👀‼️🆕🌞🟡🔵🟣⚪️❤️🩶🖊️🐌🐰⛓💙🩷💚💜🧡💛💬🗒🗣🔘🔜🔛🔚🔙😊😁😂🤣😍🥰😘💕❤️‍🔥🫂🩹☺]$/,
  /^[\s\-—–_]+$/,
];

const MIN_CONTENT_LENGTH = 120;

const SERVICE_MESSAGE_PATTERNS = [
  /конференция уже в самом разгаре/i,
  /жд[её]м вас в zoom/i,
  /благодарим вас за регистрацию/i,
  /^напоминаем про сегодняшнее мероприятие/i,
  /сроки подачи заявок.*продлены/i,
  /ссылки для подключения/i,
  /обновленная информация/i,
  /^channel created$/i,
  /^channel photo updated$/i,
  /коллеги, благодарим вас за регистрацию/i,
  /ждем вас в zoom/i,
  /напомина[емя]/i,
  /ссылки отправлены/i,
  /жд[её]м вас/i,
  /^уже сегодня[\.!]?$/i,
  /^уже сегодня\b/i,
];

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, c) =>
      String.fromCodePoint(Number.parseInt(c, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#[xy]?\w+;/g, "")
    .replace(/&[a-z]+;/g, "");
}

function removeEmoji(text: string): string {
  return text.replace(DECORATIVE_SEPARATORS, "");
}

function removeMarkdown(text: string): string {
  return text
    .replace(MARKDOWN_BOLDITALIC, "$1")
    .replace(MARKDOWN_BOLD, "$1")
    .replace(MARKDOWN_ITALIC, "$1")
    .replace(MARKDOWN_CODE, "$1")
    .replace(MARKDOWN_UNDERSCORE, "$1")
    .replace(MARKDOWN_STRIKETHROUGH, "$1")
    .replace(HTML_TAG, "");
}

function removeUrls(text: string): string {
  return text.replace(URL_PATTERN, "");
}

function normalizeHyphens(text: string): string {
  return text
    .replace(/9\s*Мая\s*[-–—]\s*это/gi, "9 Мая — это")
    .replace(/\bSPSS\s*[-–—]\s*он\b/gi, "SPSS — он")
    .replace(HYPHEN_NORMALIZE, "$1 — это");
}

function removeParensUrls(text: string): string {
  return text.replace(PARENS_URL_PATTERN, "");
}

function removeAllEmoji(text: string): string {
  return text.replace(EMOJI_ALL, "").trim();
}

function cleanWhitespace(text: string): string {
  return text
    .replace(REPEATING_CHARS, "$1$1$1")
    .replace(TRIM_PATTERN, "")
    .trim();
}

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function cleanContentText(text: string): string {
  if (!text) return "";
  let result = decodeHtmlEntities(text);
  result = removeEmoji(result);
  result = removeAllEmoji(result);
  result = removeMarkdown(result);
  result = removeParensUrls(result);
  result = removeUrls(result);
  result = result.replace(/новости[_\s]*мгу/gi, "");
  result = result.replace(HASHTAG_PATTERN, "");
  result = result.replace(/\(\?q=[^)]*\)/g, "");
  result = result.replace(QUERY_PARAM_PATTERN, "");
  result = result.replace(/\uFFFD/g, "");
  result = result.replace(/[\uD800-\uDFFF]/g, "");
  result = result.replace(/\(\)/g, "");
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&;/g, "");
  result = result.replace(/&[a-z]+;/g, "");
  result = result.replace(/\s*\(https?:\/\/[^)]*\)\s*/g, " ");
  result = result.replace(/[\*\_\#\~`]{2,}/g, "");
  result = result.replace(/[\*\_\#\~`]/g, "");
  result = result.replace(/[ \t]+/g, " ");
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/^\s*\n/gm, "");
  result = normalizeHyphens(result);
  return cleanWhitespace(result);
}

function isSystemPost(
  post: Pick<Post, "title" | "excerpt" | "content">
): boolean {
  const title = post.title.toLowerCase().trim();
  const excerpt = post.excerpt.toLowerCase().trim();
  const content = post.content.toLowerCase().trim();

  if (
    SYSTEM_KEYWORDS.some(
      (kw) => title === kw || excerpt === kw || content === kw
    )
  ) {
    return true;
  }

  if (SYSTEM_PATTERNS.some((p) => p.test(title))) {
    return true;
  }

  return false;
}

function isMostlyEmoji(text: string): boolean {
  const clean = text.replace(/\s/g, "");
  if (clean.length === 0) return false;
  const emojiCount = (clean.match(DECORATIVE_SEPARATORS) || []).length;
  return emojiCount / clean.length > 0.4;
}

function isMostlyDecoration(text: string): boolean {
  const clean = text.replace(/\s/g, "");
  if (clean.length === 0) return true;
  const decorCount = (clean.match(DECORATIVE_SEPARATORS) || []).length;
  return decorCount / clean.length > 0.5;
}

function isContentEmpty(text: string): boolean {
  if (!text || text.length < MIN_CONTENT_LENGTH) return true;
  const cleaned = text
    .replace(DECORATIVE_SEPARATORS, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(URL_PATTERN, "")
    .replace(HASHTAG_PATTERN, "")
    .replace(/\s+/g, "")
    .trim();
  return (
    cleaned.length < MIN_CONTENT_LENGTH ||
    EMPTY_CONTENT_PATTERNS.some((p) => p.test(cleaned))
  );
}

function extractLinks(text: string): Array<{ url: string; label: string }> {
  const links: Array<{ url: string; label: string }> = [];
  const seen = new Set<string>();

  const urlRegex = /(https?:\/\/\S+)/g;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1].replace(/[.,;!?)]+$/, "");
    if (!seen.has(url)) {
      seen.add(url);
      let label = "Открыть источник";

      if (url.includes("zoom.us") || url.includes("zoom.com")) {
        label = "Подключиться";
      } else if (
        url.includes("forms.gle") ||
        url.includes("docs.google.com/forms") ||
        url.includes("lomonosov-msu.ru/rus/event")
      ) {
        label = "Форма регистрации";
      } else if (url.includes("t.me")) {
        label = "Открыть в Telegram";
      } else if (
        url.includes("digitalchildhood") ||
        url.includes("lomonosov-msu") ||
        url.includes("xn--")
      ) {
        label = "Подробнее";
      }

      links.push({ url, label });
    }
  }

  return links;
}

function generateTitleFromContent(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => cleanAll(l))
    .filter(
      (l) => l.length > 20 && !isMostlyEmoji(l) && !isMostlyDecoration(l)
    );

  for (const line of lines) {
    const clean = cleanTitleLine(line);
    if (clean.length > 15 && clean.length <= 90) {
      return clean;
    }
  }

  if (lines.length > 0) {
    const clean = cleanTitleLine(lines[0]);
    if (clean.length > 5) return clean.substring(0, 90);
  }

  return "";
}

function cleanAll(text: string): string {
  if (!text) return "";
  let result = decodeHtmlEntities(text);
  result = removeEmoji(result);
  result = removeAllEmoji(result);
  result = removeMarkdown(result);
  result = removeParensUrls(result);
  result = removeUrls(result);
  result = result.replace(HASHTAG_PATTERN, "");
  result = result.replace(/\(\?q=[^)]*\)/g, "");
  result = result.replace(QUERY_PARAM_PATTERN, "");
  result = result.replace(/\uFFFD/g, "");
  result = result.replace(/[\uD800-\uDFFF]/g, "");
  result = result.replace(/\(\)/g, "");
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&;/g, "");
  result = result.replace(/&[a-z]+;/g, "");
  result = result.replace(/\s*\(https?:\/\/[^)]*\)\s*/g, " ");
  result = result.replace(/[\*\_\#\~`]{2,}/g, "");
  result = result.replace(/[\*\_\#\~`]/g, "");
  result = result.replace(/\s{2,}/g, " ");
  result = normalizeHyphens(result);
  return collapseSpaces(result);
}

function cleanLink(text: string): string {
  let result = text
    .replace(PARENS_URL_PATTERN, "")
    .replace(URL_PATTERN, "")
    .replace(HASHTAG_PATTERN, "")
    .replace(QUERY_PARAM_PATTERN, "")
    .replace(ZOOM_PATTERN, "")
    .replace(TELEGRAM_LINK_PATTERN, "")
    .replace(FORMS_PATTERN, "")
    .replace(DATE_PATTERN, "")
    .replace(TIME_PATTERN, "")
    .replace(/\uFFFD/g, "")
    .replace(/[\uD800-\uDFFF]/g, "");

  for (const label of LABEL_PATTERNS) {
    result = result.replace(label, "");
  }

  result = normalizeHyphens(result);

  return result;
}

function cleanTitleLine(text: string): string {
  let result = text
    .replace(
      /^(?:тема|лектор|место|адрес|когда|где|стоимость|цена|дедлайн|организатор|формат|ссылка|регистрация|zoom|дата|время)[:\s-]*/gi,
      ""
    )
    .replace(/^\d+\s*[.:)]\s*/, "")
    .replace(/подробнее.*/gi, "")
    .replace(/читать\s+нас\s+в.*/gi, "")
    .replace(/узнайте больше.*/gi, "")
    .trim();

  return result;
}

function isRepost(text: string): boolean {
  return REPOST_PATTERN.test(text) || REPOST_KEYWORDS.test(text);
}

function generateCoverTitle(title: string): string {
  const cleaned = title.replace(TRIM_PATTERN, "").trim();
  if (!cleaned) return "";
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
  if (words.length <= 5) return cleaned;
  const short = words.slice(0, 4).join(" ");
  if (short.length <= 40) return short + "…";
  return words.slice(0, 3).join(" ") + "…";
}

export function deduplicatePosts<
  T extends { cleanTitle: string; content: string },
>(posts: T[]): T[] {
  const seenTitles = new Set<string>();
  const seenContent = new Set<string>();
  const seenNormalized = new Set<string>();

  return posts.filter((post) => {
    const titleKey = post.cleanTitle.toLowerCase().trim();

    if (!titleKey || titleKey.length === 0) return false;
    if (seenTitles.has(titleKey)) return false;
    seenTitles.add(titleKey);

    const contentKey = post.content.replace(/\s+/g, "").toLowerCase().trim();
    if (contentKey.length > 20) {
      if (seenContent.has(contentKey)) return false;
      seenContent.add(contentKey);
    }

    const normalized = post.cleanTitle
      .replace(/\s+/g, "")
      .toLowerCase()
      .substring(0, 40);
    if (seenNormalized.has(normalized)) return false;
    seenNormalized.add(normalized);

    return true;
  });
}

export interface NormalizedPost {
  id: string;
  title: string;
  cleanTitle: string;
  coverTitle: string;
  excerpt: string;
  content: string;
  contentClean: string;
  category: string;
  rubric: string;
  date: string;
  image: string;
  tags: string[];
  telegramId?: string;
  telegramLink?: string;
  createdAt: string;
  updatedAt: string;
  links: Array<{ url: string; label: string }>;
  isSystem: boolean;
  isRepost: boolean;
}

function normalizeTitle(
  title: string,
  content: string,
  rubric: string
): string {
  const raw = decodeHtmlEntities(title);
  const withoutLinks = cleanLink(raw);

  let result = withoutLinks
    .replace(/^###?\s*/gm, "")
    .replace(/\uFFFD/g, "")
    .replace(/\s{2,}/g, " ");

  result = cleanAll(result);

  result = result.replace(MARKDOWN_BOLD, "$1").replace(MARKDOWN_ITALIC, "$1");

  result = result
    .replace(/\bдата:\s*\d+\s+\S+\s+\d{4}\s*года?\s*/gi, "")
    .replace(/\bвремя:\s*\d{1,2}:\d{2}\s*.*/gi, "")
    .replace(/\bформат:\s*.*/gi, "")
    .replace(/\bzoom\b\s*/gi, "")
    .replace(/\bzoom:\s*/gi, "")
    .replace(/новости[_\s]*мгу/gi, "")
    .replace(/Ломоносов\s*[-–]\s*[»»]\s*/gi, "Ломоносов» ")
    .replace(/ЛОМОНОСОВ\s*[-–]\s*[»»]\s*/gi, "ЛОМОНОСОВ» ")
    .replace(/который состоится\s*[-–]\s*\S+\s+года/gi, "который состоится")
    .trim();

  if (rubric) {
    const rubricEscaped = rubric.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rubricPrefix = new RegExp(`^${rubricEscaped}[:\\s-]+`, "i");
    result = result.replace(rubricPrefix, "").trim();
  }

  result = result.replace(/^анонс$/i, "").trim();

  result = collapseSpaces(result);

  if (
    result.length > 0 &&
    !isMostlyEmoji(result) &&
    !isMostlyDecoration(result)
  ) {
    return result.substring(0, 90);
  }

  const generated = generateTitleFromContent(content);
  return generated ? generated.substring(0, 90) : "";
}

function shouldHidePost(
  post: Post,
  normalized: Partial<NormalizedPost>
): boolean {
  if (normalized.isSystem) return true;

  if (isContentEmpty(post.content) && isContentEmpty(post.excerpt)) return true;

  const cleanT = normalized.cleanTitle || "";
  if (!cleanT && !normalized.rubric) return true;

  if (isMostlyDecoration(post.title) && isContentEmpty(post.content))
    return true;

  if (
    SERVICE_MESSAGE_PATTERNS.some(
      (p) => p.test(cleanT) || p.test(post.title) || p.test(post.content)
    )
  )
    return true;

  return false;
}

function trimTags(tags: string[]): string[] {
  const meaningful = tags.filter((t) => {
    const lower = t.toLowerCase().trim();
    return !TAG_BLACKLIST.has(lower) && lower.length > 1;
  });
  if (meaningful.length === 0 && tags.length > 0) {
    const nonEmpty = tags.filter((t) => t.trim().length > 1);
    return nonEmpty.slice(0, 3);
  }
  return meaningful.slice(0, 3);
}

function filterPostsWithoutTags(posts: NormalizedPost[]): NormalizedPost[] {
  return posts.filter(
    (post) => post.tags.length > 0 || post.cleanTitle.length > 0
  );
}

export function normalizePost(post: Post): NormalizedPost | null {
  const isSystem = isSystemPost(post);
  if (isSystem) return null;

  const manualRubric = getManualPostRubric(post.id);
  const rubric = manualRubric || getPostRubric(post);
  const rawCleanTitle =
    TITLE_OVERRIDES[post.id] ||
    normalizeTitle(post.title, post.content, rubric);
  const contentClean = cleanContentText(post.content);
  let excerptClean = cleanAll(post.excerpt);

  if (rawCleanTitle) {
    const partPrefix = /^часть\s*\d+\s*\.\s*/i;
    const excerptWithoutPart = excerptClean.replace(partPrefix, "");
    const titleForComparison = rawCleanTitle.replace(partPrefix, "").trim();
    if (excerptWithoutPart.startsWith(titleForComparison)) {
      excerptClean = excerptWithoutPart
        .slice(titleForComparison.length)
        .replace(/^[\s,;:.!?\-—]+/, "")
        .trim();
    }
  }
  if (rubric && excerptClean.startsWith(rubric)) {
    excerptClean = excerptClean
      .slice(rubric.length)
      .replace(/^[\s,;:.!?\-—]+/, "")
      .trim();
  }

  const links = extractLinks(post.content);
  const category = post.category;

  const normalized: NormalizedPost = {
    id: post.id,
    title: post.title,
    cleanTitle: rawCleanTitle,
    coverTitle: generateCoverTitle(rawCleanTitle),
    excerpt: excerptClean,
    content: post.content,
    contentClean,
    category,
    rubric,
    date: post.date,
    image: post.image,
    tags: trimTags(post.tags),
    telegramId: post.telegramId,
    telegramLink: post.telegramLink,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    links,
    isSystem,
    isRepost: isRepost(post.title) || isRepost(post.content),
  };

  if (shouldHidePost(post, normalized)) {
    return null;
  }

  return normalized;
}

export function normalizePosts(posts: Post[]): NormalizedPost[] {
  const normalized: NormalizedPost[] = [];

  for (const post of posts) {
    const n = normalizePost(post);
    if (n) normalized.push(n);
  }

  return filterPostsWithoutTags(deduplicatePosts(normalized));
}

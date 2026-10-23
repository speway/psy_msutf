/**
 * Small, deterministic text sanitizer for public post fields.
 *
 * It fixes common Telegram typography leftovers after parsing. Keep it strict:
 * no semantic rewriting, only safe punctuation/spacing corrections.
 */

const DASH = "[-–—‑‒−]";
const DASH_RE = new RegExp(DASH, "gu");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCommonPredicateDash(text: string): string {
  let result = text;

  const terms = [
    "SPSS",
    "ANOVA",
    "MANOVA",
    "Jamovi",
    "JASP",
    "Excel",
    "Google Forms",
    "Zoom",
    "Telegram",
    "МГУ",
    "ТФ МГУ",
    "9 Мая",
    "Сессия",
    "Психология",
    "Ломоносов-2026",
  ];

  const endBoundary = "(?=$|[\\s.,;:!?»”\\)\\]])";

  for (const term of terms) {
    const escapedTerm = escapeRegExp(term).replace(/\s+/g, "\\s+");
    const pattern = new RegExp(
      `(^|[^\\p{L}\\p{N}])(${escapedTerm})\s*${DASH}\s*(это|он|она|оно|они)${endBoundary}`,
      "giu"
    );
    result = result.replace(pattern, `$1${term} — $3`);
  }

  // General Russian one-word cases: «Сессия-это», «Психология-это».
  result = result.replace(
    /(^|[^\p{L}\p{N}])([А-ЯЁа-яё]{3,})\s*[-–—‑‒−]\s*(это)(?=$|[\s.,;:!?»”\)\]])/giu,
    "$1$2 — $3"
  );

  // Acronyms and short Latin names: «SPSS - он», «ANOVA-это».
  result = result.replace(
    /(^|[^\p{L}\p{N}])([A-ZА-ЯЁ]{2,}(?:\s+[A-ZА-ЯЁ]{2,})?)\s*[-–—‑‒−]\s*(это|он|она|оно|они)(?=$|[\s.,;:!?»”\)\]])/giu,
    "$1$2 — $3"
  );

  return result;
}

function healClippedCapitalLetters(text: string): string {
  let result = text;
  // Fuse words accidentally split by markdown bold/italic tags, e.g. "В***стреча" -> "Встреча"
  result = result.replace(/([А-Яа-яЁёA-Za-z])(?:\*|_)+([А-Яа-яЁёA-Za-z])/gu, "$1$2");
  result = result.replace(/([А-Яа-яЁёA-Za-z])(?:\*|_)+\s*(?:\*|_)+([А-Яа-яЁёA-Za-z])/gu, "$1$2");

  // Restore leading capital letters eaten by Telegram custom letter emoji tags
  result = result.replace(
    /(^|[\n.?!]\s*|[«"“'‘(]|\b)сихолог([а-яё]*)/gu,
    "$1Психолог$2"
  );
  result = result.replace(
    /(^|[\n.?!]\s*|[«"“'‘(]|\b)кзаменариум/gu,
    "$1Экзаменариум"
  );
  result = result.replace(
    /(^|[\n.?!]\s*|[«"“'‘(]|\b)стреча с представителем/gu,
    "$1Встреча с представителем"
  );
  result = result.replace(
    /(^|[\n.?!]\s*|[«"“'‘(]|\b)ежавю и жамевю/gu,
    "$1Дежавю и жамевю"
  );

  return result;
}

export function sanitizePublicText(text: string): string {
  if (!text) return "";

  const healed = healClippedCapitalLetters(text);

  return normalizeCommonPredicateDash(healed)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])([^\s\n»”")])/g, "$1 $2")
    .replace(new RegExp(`\\s*${DASH}\\s*`, "gu"), (dash) => {
      // Preserve inner word hyphens like «научно-исследовательский».
      // This callback receives only the matched dash segment; if spaces were present,
      // normalize them to a readable em dash with spaces.
      return /\s/.test(dash) || DASH_RE.test(dash.replace(/-/g, "")) ? " — " : dash;
    })
    .replace(/\s*—\s*(это|он|она|оно|они)\b/giu, " — $1")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizePostTextFields<
  T extends { title?: string; excerpt?: string; content?: string },
>(post: T): T {
  return {
    ...post,
    title: post.title === undefined ? post.title : sanitizePublicText(post.title),
    excerpt: post.excerpt === undefined ? post.excerpt : sanitizePublicText(post.excerpt),
    content: post.content === undefined ? post.content : sanitizePublicText(post.content),
  };
}

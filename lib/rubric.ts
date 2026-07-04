import type { Post } from "./models";

const ANNOUNCEMENT_KEYWORDS =
  /лекци|курс|мероприят|конференци|вебинар|семинар|школ[ауеы]|мастер.?класс|фестивал|форум|круглый\s*стол/i;

const SCIENCE_KEYWORDS =
  /научн[аяы]е?|исследован|публикаци|статья|журнал|издани|монографи|диссертаци|эксперимент|лаборатор/i;

const EDUCATION_KEYWORDS =
  /учебн[аяы]е?|образовательн|студент|заняти[йя]|олимпиад|курс[ао]в[аяы]|семинар|лекци|тренинг|практикум/i;

const PSYCHOEDUCATION_KEYWORDS =
  /психопросвещ|психик|ментальн[оы]е?|благополучи|совет|рекомендаци|самопомощ|прокрастинаци|выгорани|тревог|стресс|депресси|отношени|личность|тип\s*личности|акцентуаци|характер/i;

const OPPORTUNITIES_KEYWORDS =
  /возможност|грант|стипенди|конкурс|стажировк|ваканси|отбор|участи[йе]|бесплатн|регистраци/i;

const RESULTS_KEYWORDS =
  /итог[ио]|результат|завершени|окончани|прош[ела]|состоя[л]?[аи]сь|провед[её]н/i;

const MEMORIAL_KEYWORDS =
  /памят[ьи]|поздравлени|праздник|день\s+побед|8\s*март|новы[йг]\s*год|год?овщин/i;

const ABOUT_KEYWORDS =
  /о\s*сектор|приветств|добро\s*пожал|знакомств|наш\s*канал|научны[й]\s*сектор/i;

const OVERRIDE_RULES: Array<{ pattern: RegExp; rubric: Rubric }> = [
  { pattern: /\bspss\b/i, rubric: "Учебные материалы" },
  {
    pattern: /почему\s+она\s+просто\s+не\s+ушла/i,
    rubric: "Психопросвещение",
  },
  {
    pattern: /ребенок\s+в\s+цифровом\s+мире|digitalchildhood/i,
    rubric: "Возможности",
  },
  { pattern: /ломоносов.*психологи/i, rubric: "Научная деятельность" },
  { pattern: /тип\s+личности|акцентуаци/i, rubric: "Психопросвещение" },
  { pattern: /стокгольмск/i, rubric: "Психопросвещение" },
  { pattern: /олимпиад.*психологи/i, rubric: "Анонсы" },
  { pattern: /круглый\s+стол.*наук/i, rubric: "О секторе" },
  { pattern: /зимн.*психологическ.*школ/i, rubric: "Анонсы" },
  { pattern: /психология\s+вне\s+времени/i, rubric: "Анонсы" },
  { pattern: /программ.*зимн.*школ/i, rubric: "Анонсы" },
  { pattern: /ломоносов-\d{4}/i, rubric: "Научная деятельность" },
  {
    pattern: /издание.*мгу.*ведущим.*психологическим.*журналом/i,
    rubric: "Научная деятельность",
  },
];

export const MANUAL_POST_OVERRIDES: Record<string, { rubric: Rubric }> = {
  "tg-117": { rubric: "Научная деятельность" },
  "tg-72": { rubric: "Научная деятельность" },
  "tg-28": { rubric: "Анонсы" },
  "tg-93": { rubric: "Возможности" },
  "tg-95": { rubric: "Итоги" },
  "tg-50": { rubric: "Психопросвещение" },
  "tg-101": { rubric: "Анонсы" },
  "tg-103": { rubric: "Возможности" },
  "tg-112": { rubric: "Анонсы" },
  "tg-114": { rubric: "Анонсы" },
  "tg-115": { rubric: "Анонсы" },
  "tg-100": { rubric: "Научная деятельность" },
  "tg-105": { rubric: "Памятные даты" },
  "tg-107": { rubric: "Анонсы" },
  "tg-110": { rubric: "Анонсы" },
  "tg-79": { rubric: "Психопросвещение" },
  "tg-118": { rubric: "Психопросвещение" },
  "tg-116": { rubric: "Возможности" },
  "tg-94": { rubric: "Научная деятельность" },
  "tg-96": { rubric: "Учебные материалы" },
  "tg-97": { rubric: "Психопросвещение" },
  "tg-98": { rubric: "Памятные даты" },
  "tg-102": { rubric: "Анонсы" },
  "tg-104": { rubric: "Возможности" },
  "tg-106": { rubric: "Итоги" },
  "tg-108": { rubric: "Учебные материалы" },
  "tg-109": { rubric: "Психопросвещение" },
  "tg-111": { rubric: "Анонсы" },
  "tg-113": { rubric: "Научная деятельность" },
  "tg-57": { rubric: "Анонсы" },
  "tg-66": { rubric: "Учебные материалы" },
  "tg-88": { rubric: "Психопросвещение" },
};

export function getManualPostRubric(postId: string): Rubric | null {
  const override = MANUAL_POST_OVERRIDES[postId];
  return override ? override.rubric : null;
}

export function detectRubric(text: string): string {
  const lower = text.toLowerCase();

  for (const rule of OVERRIDE_RULES) {
    if (rule.pattern.test(lower)) return rule.rubric;
  }

  if (ABOUT_KEYWORDS.test(lower)) return "О секторе";
  if (MEMORIAL_KEYWORDS.test(lower)) return "Памятные даты";
  if (RESULTS_KEYWORDS.test(lower)) return "Итоги";
  if (OPPORTUNITIES_KEYWORDS.test(lower)) return "Возможности";
  if (PSYCHOEDUCATION_KEYWORDS.test(lower)) return "Психопросвещение";
  if (EDUCATION_KEYWORDS.test(lower)) return "Учебные материалы";
  if (ANNOUNCEMENT_KEYWORDS.test(lower)) return "Анонсы";
  if (SCIENCE_KEYWORDS.test(lower)) return "Научная деятельность";

  return "";
}

export function getPostRubric(
  post: Pick<Post, "title" | "excerpt" | "content" | "image" | "id">
): string {
  const manual = getManualPostRubric(post.id);
  if (manual) return manual;
  const text = `${post.title} ${post.excerpt} ${post.content}`;
  const rubric = detectRubric(text);
  if (rubric) return rubric;
  return "";
}

export type Rubric =
  | "Все"
  | "Анонсы"
  | "Научная деятельность"
  | "Учебные материалы"
  | "Психопросвещение"
  | "Возможности"
  | "Итоги"
  | "Памятные даты"
  | "О секторе";

export const RUBRICS: Rubric[] = [
  "Все",
  "Анонсы",
  "Научная деятельность",
  "Учебные материалы",
  "Психопросвещение",
  "Возможности",
  "Итоги",
  "Памятные даты",
  "О секторе",
];

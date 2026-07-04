export function extractHashtagTags(text: string): string[] {
  const cleaned = text.replace(/\(\?q=[^)]*\)/g, "");
  const hashtagRegex = /#([а-яА-Яa-zA-Z0-9_]+)/g;
  const tags: string[] = [];
  const seen = new Set<string>();

  const hashtagTagMap: Record<string, string> = {
    анонсы: "Анонсы",
    психопросвещение: "Психопросвещение",
    учебные_материалы: "Учебные материалы",
    научная_деятельность: "Научная деятельность",
    возможности: "Возможности",
    итоги: "Итоги",
    памятные_даты: "Памятные даты",
    спс: "SPSS",
    spss: "SPSS",
    совет: "Совет",
    новости: "",
    новости_мгу: "",
  };

  let match;
  while ((match = hashtagRegex.exec(cleaned)) !== null) {
    const rawTag = match[1].toLowerCase();

    if (hashtagTagMap[rawTag]) {
      if (!seen.has(hashtagTagMap[rawTag])) {
        seen.add(hashtagTagMap[rawTag]);
        tags.push(hashtagTagMap[rawTag]);
      }
      continue;
    }

    if (/^[a-zA-Z0-9]+$/.test(rawTag)) continue;

    const normalized = rawTag
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (!seen.has(normalized) && normalized.length > 1) {
      seen.add(normalized);
      tags.push(normalized);
    }
  }

  return tags;
}

export function generateTags(text: string): string[] {
  return extractHashtagTags(text).slice(0, 3);
}

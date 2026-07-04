import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import type { Post } from "@/lib/models";
import { glossaryTerms, glossaryCollections } from "@/data/glossary";
import { disciplinesData, ALLOWED_DUPLICATES } from "@/data/disciplines";

import { getAllSiteChecks } from "@/lib/check-site-health";

interface Issue {
  postId: string;
  title: string;
  problems: string[];
}

function checkPost(post: Post): string[] {
  const problems: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    problems.push("Пустой title");
  }

  if (!post.category || post.category.trim().length === 0) {
    problems.push("Нет раздела (category)");
  }

  const titleContent = post.title + " " + post.content + " " + post.excerpt;

  if (titleContent.includes("\uFFFD")) {
    problems.push("Символ �");
  }

  const starCount = (titleContent.match(/\*/g) || []).length;
  if (starCount > 0) {
    problems.push(`Звёздочки * (${starCount} шт.)`);
  }

  const qMatch = titleContent.match(/\?q=[^\s)*]*/g);
  if (qMatch) {
    problems.push(`(?q=...) параметры (${qMatch.length})`);
  }

  if (
    post.title.includes("http://") ||
    post.title.includes("https://") ||
    post.title.includes("t.me/")
  ) {
    problems.push("Сырой URL в title");
  }

  const emojiMatch = titleContent.match(
    /[\u{1F000}-\u{1FFFF}\u{200D}\u{FE0F}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu
  );
  if (emojiMatch && emojiMatch.length > 0) {
    problems.push(`Emoji (${emojiMatch.length} шт.)`);
  }

  if (post.title.includes("академическое подразделение")) {
    problems.push("Устаревшая фраза: «академическое подразделение»");
  }

  if (titleContent.includes("Scopusновостимгу")) {
    problems.push("«Scopusновостимгу»");
  }

  if (post.excerpt && post.title && post.excerpt.includes(post.title)) {
    problems.push("Title повторяется в excerpt");
  }

  if (post.excerpt && post.category && post.excerpt.includes(post.category)) {
    problems.push("Section повторяется в excerpt");
  }

  if (titleContent.includes("Ломоносов- ")) {
    problems.push("«Ломоносов- » (с пробелом)");
  }

  if (titleContent.includes("Часть .")) {
    problems.push("«Часть .»");
  }

  if (titleContent.includes("1 лет работы")) {
    problems.push("«1 лет работы»");
  }

  if (titleContent.includes("2026 Последний год")) {
    problems.push("«2026 Последний год»");
  }

  if (titleContent.includes("ведущий психологический центр России")) {
    problems.push("Устаревшая фраза: «ведущий психологический центр России»");
  }

  if (titleContent.includes("более 200 выпускников")) {
    problems.push("Устаревшая фраза: «более 200 выпускников»");
  }

  if (titleContent.includes("легендарная аудитория")) {
    problems.push("Устаревшая фраза: «легендарная аудитория»");
  }

  const contentLen = (post.content || "").replace(/\s+/g, "").length;
  const excerptLen = (post.excerpt || "").replace(/\s+/g, "").length;
  if (contentLen + excerptLen < 120) {
    problems.push(`Короткий контент (${contentLen + excerptLen} символов)`);
  }

  if (post.content && post.content.includes("```")) {
    problems.push("Блок кода в контенте");
  }

  return problems;
}

function getBadgeClass(severity: string): string {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPosts(): Post[] {
  return getSitePosts();
}

export default async function ContentHealthPage() {
  const posts = getPosts();
  const normalized = normalizePosts(posts);

  const issues: Issue[] = [];

  for (const post of posts) {
    const problems = checkPost(post);
    if (problems.length > 0) {
      issues.push({
        postId: post.id,
        title: post.title || "(пусто)",
        problems,
      });
    }
  }

  const severityMap: Record<string, "high" | "medium" | "low"> = {
    "Символ �": "high",
    "Пустой title": "high",
    "Нет раздела (category)": "high",
    "(?q=...)": "medium",
    "Сырой URL": "medium",
    Звёздочки: "low",
    Emoji: "high",
    "Устаревшая фраза": "medium",
    "Короткий контент": "low",
    "Блок кода": "medium",
    "«Scopusновостимгу»": "high",
    "Title повторяется в excerpt": "medium",
    "Section повторяется в excerpt": "low",
    "«Ломоносов- » (с пробелом)": "medium",
    "«Часть .»": "medium",
    "«1 лет работы»": "high",
    "«2026 Последний год»": "high",
  };

  const totalPosts = posts.length;
  const healthyCount = totalPosts - issues.length;
  const hiddenCount = posts.length - normalized.length;
  const totalProblems = issues.reduce((acc, i) => acc + i.problems.length, 0);

  const rubricCount = new Set(normalized.map((p) => p.rubric).filter(Boolean))
    .size;
  const dates = normalized
    .map((p) => p.date)
    .filter(Boolean)
    .sort();
  const earliestDate = dates[0] || "—";
  const latestDate = dates[dates.length - 1] || "—";

  const siteChecks = getAllSiteChecks();
  const passedChecks = siteChecks.filter((c) => c.status === "pass").length;
  const failedChecks = siteChecks.filter((c) => c.status === "fail").length;
  const warnChecks = siteChecks.filter((c) => c.status === "warn").length;

  function renderCheckItem(check: {
    name: string;
    status: string;
    details: string;
  }) {
    return (
      <div
        key={check.name}
        className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
          check.status === "pass"
            ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
            : check.status === "fail"
              ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
              : "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20"
        }`}
      >
        <span
          className={`mt-0.5 shrink-0 text-base ${
            check.status === "pass"
              ? "text-green-600 dark:text-green-400"
              : check.status === "fail"
                ? "text-red-600 dark:text-red-400"
                : "text-yellow-600 dark:text-yellow-400"
          }`}
        >
          {check.status === "pass" ? "✓" : check.status === "fail" ? "✗" : "⚠"}
        </span>
        <div className="min-w-0">
          <p
            className={`font-medium ${
              check.status === "pass"
                ? "text-green-800 dark:text-green-300"
                : check.status === "fail"
                  ? "text-red-800 dark:text-red-300"
                  : "text-yellow-800 dark:text-yellow-300"
            }`}
          >
            {check.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {check.details}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            /debug/content-health
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Проверка качества контента
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Всего постов</p>
            <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
          </div>
          <div className="rounded-lg border bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              Здоровых
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {healthyCount}
            </p>
          </div>
          <div className="rounded-lg border bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              С проблемами
            </p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {issues.length}
            </p>
          </div>
          <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Всего проблем
            </p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {totalProblems}
            </p>
          </div>
          <div className="rounded-lg border bg-orange-50 dark:bg-orange-900/20 p-4">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Скрыто после normalize
            </p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {hiddenCount}
            </p>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-lg text-muted-foreground">Проблем не найдено</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Проблемы
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issues.map((issue) => (
                  <tr key={issue.postId} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {issue.postId}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-foreground">
                      {issue.title}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {issue.problems.map((problem) => {
                          const key = problem.startsWith("Звёздочки")
                            ? "Звёздочки"
                            : problem.startsWith("(?q=...)")
                              ? "(?q=...)"
                              : problem.startsWith("Сырой URL")
                                ? "Сырой URL"
                                : problem.startsWith("Emoji")
                                  ? "Emoji"
                                  : problem.startsWith("Устаревшая фраза")
                                    ? "Устаревшая фраза"
                                    : problem.startsWith("Короткий контент")
                                      ? "Короткий контент"
                                      : problem.startsWith("Блок кода")
                                        ? "Блок кода"
                                        : problem.startsWith(
                                              "«Scopusновостимгу»"
                                            )
                                          ? "«Scopusновостимгу»"
                                          : problem.startsWith(
                                                "Title повторяется"
                                              )
                                            ? "Title повторяется в excerpt"
                                            : problem.startsWith(
                                                  "Section повторяется"
                                                )
                                              ? "Section повторяется в excerpt"
                                              : problem.startsWith(
                                                    "«Ломоносов- »"
                                                  )
                                                ? "«Ломоносов- » (с пробелом)"
                                                : problem.startsWith(
                                                      "«Часть .»"
                                                    )
                                                  ? "«Часть .»"
                                                  : problem.startsWith(
                                                        "«1 лет работы»"
                                                      )
                                                    ? "«1 лет работы»"
                                                    : problem.startsWith(
                                                          "«2026 Последний год»"
                                                        )
                                                      ? "«2026 Последний год»"
                                                      : problem;
                          const severity = severityMap[key] || "low";
                          return (
                            <span
                              key={problem}
                              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${getBadgeClass(severity)}`}
                            >
                              {problem}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Дубли заголовков
          </h2>
          {(() => {
            const titleCounts = new Map<string, string[]>();
            for (const post of posts) {
              const t = (post.title || "").toLowerCase().trim();
              if (!t) continue;
              if (!titleCounts.has(t)) titleCounts.set(t, []);
              titleCounts.get(t)!.push(post.id);
            }
            const duplicates = Array.from(titleCounts.entries()).filter(
              ([, ids]) => ids.length > 1
            );
            if (duplicates.length === 0) {
              return (
                <p className="text-sm text-muted-foreground">
                  Дубликатов не найдено
                </p>
              );
            }
            return (
              <div className="space-y-2">
                {duplicates.map(([title, ids]) => (
                  <div key={title} className="flex items-start gap-2 text-sm">
                    <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-800 dark:text-red-400 shrink-0">
                      {ids.length}x
                    </span>
                    <span className="text-foreground truncate">{title}</span>
                    <span className="text-muted-foreground font-mono text-xs shrink-0">
                      ({ids.join(", ")})
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Дубли дисциплин */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Дубли дисциплин
          </h2>
          {(() => {
            const allDisciplines: { name: string; location: string }[] = [];
            for (const program of disciplinesData) {
              const levelLabel =
                program.level === "bachelor" ? "Бакалавриат" : "Магистратура";
              for (const c of program.courses) {
                for (const s of c.subjects) {
                  allDisciplines.push({
                    name: s,
                    location: `${levelLabel} / ${program.title} / ${c.course} курс`,
                  });
                }
              }
            }
            const counts = new Map<
              string,
              { count: number; locations: string[] }
            >();
            for (const entry of allDisciplines) {
              if (!counts.has(entry.name)) {
                counts.set(entry.name, { count: 0, locations: [] });
              }
              counts.get(entry.name)!.count++;
              counts.get(entry.name)!.locations.push(entry.location);
            }
            const duplicates = Array.from(counts.entries())
              .filter(([, v]) => v.count > 1)
              .map(([name, v]) => ({
                name,
                count: v.count,
                locations: v.locations,
                allowed: ALLOWED_DUPLICATES.includes(name),
              }))
              .sort((a, b) => {
                if (a.allowed !== b.allowed) return a.allowed ? 1 : -1;
                return b.count - a.count;
              });
            if (duplicates.length === 0) {
              return (
                <p className="text-sm text-muted-foreground">
                  Дубликатов не найдено
                </p>
              );
            }
            const realDupes = duplicates.filter((d) => !d.allowed);
            const allowedDupes = duplicates.filter((d) => d.allowed);
            return (
              <div className="space-y-4">
                {realDupes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
                      Недопустимые дубликаты ({realDupes.length})
                    </p>
                    <div className="space-y-2">
                      {realDupes.map((dup) => (
                        <div
                          key={dup.name}
                          className="flex flex-col gap-1 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-3 text-sm"
                        >
                          <div className="flex items-start gap-2">
                            <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-800 dark:text-red-400 shrink-0">
                              {dup.count}x
                            </span>
                            <span className="text-foreground font-medium">
                              {dup.name}
                            </span>
                          </div>
                          <ul className="ml-6 space-y-0.5">
                            {dup.locations.map((loc, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                {loc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {allowedDupes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-2">
                      Разрешённые дубликаты ({allowedDupes.length})
                    </p>
                    <div className="space-y-2">
                      {allowedDupes.map((dup) => (
                        <div
                          key={dup.name}
                          className="flex flex-col gap-1 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20 p-3 text-sm"
                        >
                          <div className="flex items-start gap-2">
                            <span className="inline-flex items-center rounded-md bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-400 shrink-0">
                              {dup.count}x
                            </span>
                            <span className="text-foreground font-medium">
                              {dup.name}
                            </span>
                          </div>
                          <ul className="ml-6 space-y-0.5">
                            {dup.locations.map((loc, i) => (
                              <li
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                {loc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Статистика нормализации
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-bold">Сырых постов:</span> {posts.length}
            </p>
            <p>
              <span className="font-bold">После normalize:</span>{" "}
              {normalized.length}
            </p>
            <p>
              <span className="font-bold">Скрыто:</span> {hiddenCount}
            </p>
          </div>
        </div>

        {/* Сайт в цифрах — автоматические показатели из данных сайта */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Сайт в цифрах
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Автоматические показатели из данных сайта
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Всего постов</p>
              <p className="text-lg font-bold text-foreground">
                {posts.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">После normalize</p>
              <p className="text-lg font-bold text-foreground">
                {normalized.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Рубрик</p>
              <p className="text-lg font-bold text-foreground">{rubricCount}</p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Скрыто normalize</p>
              <p className="text-lg font-bold text-foreground">{hiddenCount}</p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">
                Терминов глоссария
              </p>
              <p className="text-lg font-bold text-foreground">
                {glossaryTerms.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">
                Подборок глоссария
              </p>
              <p className="text-lg font-bold text-foreground">
                {glossaryCollections.length}
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Ранняя дата</p>
              <p className="text-sm font-bold text-foreground break-all">
                {earliestDate}
              </p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Поздняя дата</p>
              <p className="text-sm font-bold text-foreground break-all">
                {latestDate}
              </p>
            </div>
          </div>
        </div>

        {/* Здоровье сайта — статические проверки доступности, метаданных, футера */}

        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Здоровье сайта
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Статические проверки доступности, метаданных и контента
          </p>

          <div className="mb-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                Пройдено
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {passedChecks}
              </p>
            </div>
            <div className="rounded-lg border bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                Провалено
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {failedChecks}
              </p>
            </div>
            <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Предупреждения
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {warnChecks}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Всего проверок</p>
              <p className="text-2xl font-bold text-foreground">
                {siteChecks.length}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {siteChecks.map((check) => (
              <div
                key={check.name}
                className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                  check.status === "pass"
                    ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                    : check.status === "fail"
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                      : "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 text-base ${
                    check.status === "pass"
                      ? "text-green-600 dark:text-green-400"
                      : check.status === "fail"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {check.status === "pass"
                    ? "✓"
                    : check.status === "fail"
                      ? "✗"
                      : "⚠"}
                </span>
                <div className="min-w-0">
                  <p
                    className={`font-medium ${
                      check.status === "pass"
                        ? "text-green-800 dark:text-green-300"
                        : check.status === "fail"
                          ? "text-red-800 dark:text-red-300"
                          : "text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {check.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {check.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive checks — мобильная адаптивность */}

        {/* Layout check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Layout
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Footer один, header один, нет header после footer
          </p>
          <div className="space-y-2">
            {(() => {
              const layoutChecks = siteChecks.filter((c) =>
                /footer один|Нет второго header|Нет второго header после|main существует/i.test(
                  c.name
                )
              );
              if (layoutChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок layout
                  </p>
                );
              return layoutChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Routes check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Routes
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            / не редиректит на /en
          </p>
          <div className="space-y-2">
            {(() => {
              const routeChecks = siteChecks.filter((c) =>
                /не редиректит/i.test(c.name)
              );
              if (routeChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок routes
                  </p>
                );
              return routeChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Language check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Language
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            EN UI не содержит русских label без notice
          </p>
          <div className="space-y-2">
            {(() => {
              const langChecks = siteChecks.filter((c) =>
                /EN UI/i.test(c.name)
              );
              if (langChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок language
                  </p>
                );
              return langChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Design check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Design
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Нет border-radius 999px, нет PSY/psy
          </p>
          <div className="space-y-2">
            {(() => {
              const designChecks = siteChecks.filter((c) =>
                /border-radius.*999|PSY\/psy|dropdown trigger height|body font-weight/i.test(
                  c.name
                )
              );
              if (designChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок design
                  </p>
                );
              return designChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Publications check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Publications
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Нет �, новостимгу, &apos;Сессия-это&apos;
          </p>
          <div className="space-y-2">
            {(() => {
              const pubChecks = siteChecks.filter((c) =>
                /публикации:/i.test(c.name)
              );
              if (pubChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок publications
                  </p>
                );
              return pubChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Contacts check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Contacts
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Нет &apos;Приёмная комиссия&apos;, &apos;Учебный отдел&apos;,
            &apos;Вахта&apos;, &apos;Факс&apos;
          </p>
          <div className="space-y-2">
            {(() => {
              const contactChecks = siteChecks.filter((c) =>
                /контакты:/i.test(c.name)
              );
              if (contactChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок contacts
                  </p>
                );
              return contactChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Disciplines check section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Disciplines
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Счётчики курсов</p>
          <div className="space-y-2">
            {(() => {
              const discChecks = siteChecks.filter(
                (c) =>
                  /курс.*=|счётчик|предмет/i.test(c.name) ||
                  (c.name.includes("предметов") &&
                    !c.name.includes("запрещ")) ||
                  /переключатель центрирован|кнопки курсов центрированы/i.test(
                    c.name
                  )
              );
              if (discChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок disciplines
                  </p>
                );
              return discChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Hero checks section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Hero
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Нет старых hero-текстов
          </p>
          <div className="space-y-2">
            {(() => {
              const heroChecks = siteChecks.filter((c) =>
                /Hero:/i.test(c.name)
              );
              if (heroChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок hero
                  </p>
                );
              return heroChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Home checks section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Home
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Кнопка публикаций, дублирующий PsychologyMap
          </p>
          <div className="space-y-2">
            {(() => {
              const homeChecks = siteChecks.filter((c) =>
                /^Home:/i.test(c.name)
              );
              if (homeChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок home
                  </p>
                );
              return homeChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Header checks section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Header
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            MoreDropdown в едином стиле
          </p>
          <div className="space-y-2">
            {(() => {
              const headerChecks = siteChecks.filter((c) =>
                /MoreDropdown/i.test(c.name)
              );
              if (headerChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок header
                  </p>
                );
              return headerChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Archive checks section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Archive
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Аудитория 220, нет устаревших фраз
          </p>
          <div className="space-y-2">
            {(() => {
              const archiveChecks = siteChecks.filter((c) =>
                /^Archive:/i.test(c.name)
              );
              if (archiveChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок archive
                  </p>
                );
              return archiveChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Glossary checks section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Проверки Glossary
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Нет дублей разделов, устаревших фраз
          </p>
          <div className="space-y-2">
            {(() => {
              const glossaryChecks = siteChecks.filter((c) =>
                /^Glossary:/i.test(c.name)
              );
              if (glossaryChecks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок glossary
                  </p>
                );
              return glossaryChecks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Internal bugs section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Internal bugs
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            console.log в production, localStorage на уровне модуля, сломанные
            href
          </p>
          <div className="space-y-2">
            {(() => {
              const checks = siteChecks.filter((c) =>
                /console|localStorage|сломанных href/i.test(c.name)
              );
              if (checks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок internal bugs
                  </p>
                );
              return checks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Performance section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Performance
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Оптимизация изображений, next/image
          </p>
          <div className="space-y-2">
            {(() => {
              const checks = siteChecks.filter((c) =>
                /next\/image|оптимизации изображений/i.test(c.name)
              );
              if (checks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок performance
                  </p>
                );
              return checks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Loading section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Loading states
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            loading.tsx, Skeleton для загрузки контента
          </p>
          <div className="space-y-2">
            {(() => {
              const checks = siteChecks.filter((c) =>
                /загрузки|Skeleton для loading/i.test(c.name)
              );
              if (checks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок loading
                  </p>
                );
              return checks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Visual polish section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Visual / Polish
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Высота карточек, fade-in анимация
          </p>
          <div className="space-y-2">
            {(() => {
              const checks = siteChecks.filter((c) =>
                /высота карточек|Fade-in анимация/i.test(c.name)
              );
              if (checks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок visual
                  </p>
                );
              return checks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>

        {/* Vercel readiness section */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Vercel readiness
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            metadataBase, engines.node, конфигурация деплоя
          </p>
          <div className="space-y-2">
            {(() => {
              const checks = siteChecks.filter((c) =>
                /metadataBase|engines\.node|Vercel конфигурация/i.test(c.name)
              );
              if (checks.length === 0)
                return (
                  <p className="text-sm text-muted-foreground">
                    Нет проверок Vercel
                  </p>
                );
              return checks.map((check) => renderCheckItem(check));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

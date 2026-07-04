import fs from "fs";
import path from "path";
import { disciplinesData, FORBIDDEN_SUBJECTS } from "@/data/disciplines";

export interface SiteCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  details: string;
}

const appDir = path.join(process.cwd(), "app");
const componentsDir = path.join(process.cwd(), "components");
const dataDir = path.join(process.cwd(), "data");
const libDir = path.join(process.cwd(), "lib");

function readFileSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function globFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...globFiles(fullPath, pattern));
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch {
    // ignore
  }
  return results;
}

export function checkImages(): SiteCheck {
  const tsxFiles = [
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(appDir, /\.tsx$/),
  ];
  const imgTagsWithoutAlt: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const imgRegex = /<img\s[^>]*\/?>/gi;
    let match: RegExpExecArray | null;
    while ((match = imgRegex.exec(content)) !== null) {
      if (!/alt\s*=/i.test(match[0]) && !/aria-hidden\s*=/i.test(match[0])) {
        const relative = path.relative(process.cwd(), file);
        imgTagsWithoutAlt.push(relative);
      }
    }
  }

  if (imgTagsWithoutAlt.length === 0) {
    return {
      name: "alt у изображений",
      status: "pass",
      details: "Теги <img> без alt не найдены",
    };
  }

  return {
    name: "alt у изображений",
    status: "fail",
    details: `Найдено ${imgTagsWithoutAlt.length} тегов <img> без alt: ${imgTagsWithoutAlt.join(", ")}`,
  };
}

export function checkH1(): SiteCheck[] {
  const pageFiles = globFiles(appDir, /page\.tsx$/);
  const noH1: string[] = [];
  const multipleH1: string[] = [];

  for (const file of pageFiles) {
    const content = readFileSafe(file);
    const h1Matches = content.match(/<h1[\s>]/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    const relative = path.relative(process.cwd(), file);

    if (h1Count === 0) {
      noH1.push(relative);
    } else if (h1Count > 1) {
      multipleH1.push(relative);
    }
  }

  const checks: SiteCheck[] = [];

  if (noH1.length === 0) {
    checks.push({
      name: "h1 на каждой странице",
      status: "pass",
      details: "Все страницы имеют h1",
    });
  } else {
    checks.push({
      name: "h1 на каждой странице",
      status: "fail",
      details: `Страницы без h1: ${noH1.join(", ")}`,
    });
  }

  if (multipleH1.length === 0) {
    checks.push({
      name: "Не более одного h1",
      status: "pass",
      details: "Нет страниц с несколькими h1",
    });
  } else {
    checks.push({
      name: "Не более одного h1",
      status: "fail",
      details: `Страницы с >1 h1: ${multipleH1.join(", ")}`,
    });
  }

  return checks;
}

export function checkSkipLink(): SiteCheck {
  const layoutContent = readFileSafe(path.join(appDir, "layout.tsx"));
  const skipLinkExists =
    layoutContent.includes("SkipLink") &&
    (layoutContent.includes("skip-link") || layoutContent.includes("SkipLink"));

  if (skipLinkExists) {
    return {
      name: "Skip link",
      status: "pass",
      details: "Компонент SkipLink присутствует в layout.tsx",
    };
  }

  return {
    name: "Skip link",
    status: "fail",
    details: "SkipLink не найден в layout.tsx",
  };
}

export function checkBurgerAriaLabel(): SiteCheck {
  const headerContent = readFileSafe(
    path.join(componentsDir, "site-header.tsx")
  );
  const hasAriaLabel = headerContent.includes('aria-label="Меню"');
  const hasAriaExpanded = headerContent.includes("aria-expanded");
  const hasAriaControls = headerContent.includes("aria-controls");

  if (hasAriaLabel && hasAriaExpanded && hasAriaControls) {
    return {
      name: "aria-label у burger",
      status: "pass",
      details: "Burger-кнопка имеет aria-label, aria-expanded и aria-controls",
    };
  }

  const missing: string[] = [];
  if (!hasAriaLabel) missing.push("aria-label");
  if (!hasAriaExpanded) missing.push("aria-expanded");
  if (!hasAriaControls) missing.push("aria-controls");

  return {
    name: "aria-label у burger",
    status: "fail",
    details: `Отсутствуют: ${missing.join(", ")}`,
  };
}

export function checkFocusVisible(): SiteCheck {
  const cssContent = readFileSafe(path.join(appDir, "globals.css"));
  const hasFocusVisible = cssContent.includes("focus-visible");
  const hasGlobalFocusVisible = cssContent.includes("*:focus-visible");

  if (hasGlobalFocusVisible) {
    return {
      name: "Focus-visible стили",
      status: "pass",
      details:
        "Глобальный стиль *:focus-visible определён в globals.css (outline: 2px solid var(--ring))",
    };
  }

  if (hasFocusVisible) {
    return {
      name: "Focus-visible стили",
      status: "warn",
      details:
        "Стили focus-visible найдены, но глобальный селектор *:focus-visible не обнаружен",
    };
  }

  return {
    name: "Focus-visible стили",
    status: "fail",
    details: "Стили focus-visible не найдены в globals.css",
  };
}

export function checkFooterUniversity(): SiteCheck {
  const footerContent = readFileSafe(
    path.join(componentsDir, "site-footer.tsx")
  );
  const navContent = readFileSafe(path.join(dataDir, "navigation.ts"));
  const combined = footerContent + " " + navContent;

  if (combined.includes("Кафедра психологии ТФ МГУ")) {
    return {
      name: "Отсутствие 'Кафедра психологии ТФ МГУ' в footer",
      status: "fail",
      details: "Фраза 'Кафедра психологии ТФ МГУ' найдена в footer",
    };
  }

  return {
    name: "Отсутствие 'Кафедра психологии ТФ МГУ' в footer",
    status: "pass",
    details:
      "Фраза 'Кафедра психологии ТФ МГУ' отсутствует в footer и navigation",
  };
}

export function checkFooterBySpw(): SiteCheck {
  const footerContent = readFileSafe(
    path.join(componentsDir, "site-footer.tsx")
  );
  const hasBySpw =
    footerContent.includes("by") && footerContent.includes("spw");
  const hasSpewayLink =
    footerContent.includes("t.me/speway") ||
    footerContent.includes("https://t.me/speway");

  if (hasBySpw && hasSpewayLink) {
    return {
      name: "'by spw' в footer",
      status: "pass",
      details: "Фраза 'by spw' присутствует в footer со ссылкой на t.me/speway",
    };
  }

  const missing: string[] = [];
  if (!hasBySpw) missing.push("'by spw'");
  if (!hasSpewayLink) missing.push("ссылка на t.me/speway");

  return {
    name: "'by spw' в footer",
    status: "fail",
    details: `Отсутствуют: ${missing.join(", ")}`,
  };
}

export function checkOGMetadata(): SiteCheck[] {
  const layoutContent = readFileSafe(path.join(appDir, "layout.tsx"));

  const checks: SiteCheck[] = [];

  if (layoutContent.includes("openGraph")) {
    checks.push({
      name: "og:title",
      status: "pass",
      details: "openGraph.title определён в layout.tsx",
    });
  } else {
    checks.push({
      name: "og:title",
      status: "fail",
      details: "openGraph.title не найден в layout.tsx",
    });
  }

  if (
    layoutContent.includes("og:description") ||
    layoutContent.includes("description:")
  ) {
    checks.push({
      name: "og:description",
      status: "pass",
      details: "openGraph.description определён в layout.tsx",
    });
  } else {
    checks.push({
      name: "og:description",
      status: "fail",
      details: "openGraph.description не найден в layout.tsx",
    });
  }

  if (layoutContent.includes("images:")) {
    checks.push({
      name: "og:image",
      status: "pass",
      details: "openGraph.images определён в layout.tsx (/og/og-main.png)",
    });
  } else {
    checks.push({
      name: "og:image",
      status: "fail",
      details: "openGraph.images не найден в layout.tsx",
    });
  }

  return checks;
}

export function checkOldPhrases(): SiteCheck[] {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const oldPhrases: [string, string[]][] = [
    ["академическое подразделение", []],
    ["ведущий психологический центр России", []],
    ["более 200 выпускников", []],
    ["легендарная аудитория", []],
    ["официальный архив кафедры", []],
  ];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    for (const [phrase] of oldPhrases) {
      if (content.includes(phrase)) {
        oldPhrases.find(([p]) => p === phrase)?.[1].push(relative);
      }
    }
  }

  return oldPhrases.map(([phrase, files]) => {
    if (files.length === 0) {
      return {
        name: `Устаревшая фраза: «${phrase}»`,
        status: "pass" as const,
        details: `Фраза не найдена в исходном коде`,
      };
    }
    return {
      name: `Устаревшая фраза: «${phrase}»`,
      status: "fail" as const,
      details: `Найдена в ${files.length} файлах: ${files.join(", ")}`,
    };
  });
}

// ── Новые Content Health проверки ────────────────────────────────────

export function checkMainExists(): SiteCheck {
  const layoutContent = readFileSafe(path.join(appDir, "layout.tsx"));
  const langLayoutContent = readFileSafe(
    path.join(appDir, "[lang]", "layout.tsx")
  );

  const rootHasMain = /<main[\s>]/.test(layoutContent);
  const langHasMain = /<main[\s>]/.test(langLayoutContent);

  if (rootHasMain || langHasMain) {
    return {
      name: "main существует в layout",
      status: "pass",
      details: "Тег <main> найден в layout.tsx или [lang]/layout.tsx",
    };
  }

  return {
    name: "main существует в layout",
    status: "fail",
    details: "Тег <main> не найден ни в одном layout-файле",
  };
}

export function checkHeroNoOldTexts(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const oldPatterns = [
    "Погрузитесь в мир психологии",
    "Материалы, глоссарий, архив и маршруты",
    "Сайт помогает быстро найти",
    "Telegram · учебные материалы · архив",
  ];

  const filesWithOldText: { file: string; text: string }[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    for (const pattern of oldPatterns) {
      if (content.includes(pattern)) {
        filesWithOldText.push({ file: relative, text: pattern });
        break;
      }
    }
  }

  if (filesWithOldText.length === 0) {
    return {
      name: "Hero: нет старых текстов",
      status: "pass",
      details: "Старые hero-тексты не найдены в исходном коде",
    };
  }

  return {
    name: "Hero: нет старых текстов",
    status: "fail",
    details: `Найдены старые тексты в ${filesWithOldText.length} файлах: ${filesWithOldText.map((f) => `${f.file} («${f.text}»)`).join("; ")}`,
  };
}

export function checkHomeTrendingCta(): SiteCheck {
  const i18nFiles = [
    path.join(dataDir, "i18n", "ru.ts"),
    path.join(dataDir, "i18n", "en.ts"),
    path.join(dataDir, "i18n", "uz.ts"),
  ];

  const missing: string[] = [];
  for (const file of i18nFiles) {
    const content = readFileSafe(file);
    if (!content.includes("trendingCta")) {
      missing.push(path.relative(process.cwd(), file));
    }
  }

  if (missing.length === 0) {
    return {
      name: "Home: кнопка 'Все публикации'",
      status: "pass",
      details: "trendingCta присутствует во всех i18n файлах (ru/en/uz)",
    };
  }

  return {
    name: "Home: кнопка 'Все публикации'",
    status: "fail",
    details: `trendingCta отсутствует в: ${missing.join(", ")}`,
  };
}

export function checkHomeNoDuplicatePsychologyMap(): SiteCheck {
  const pageContent = readFileSafe(path.join(appDir, "page.tsx"));
  const langPageContent = readFileSafe(path.join(appDir, "[lang]", "page.tsx"));

  const combined = pageContent + "\n" + langPageContent;

  const psychologyMapCount = (combined.match(/PsychologyMap/g) || []).length;

  if (psychologyMapCount <= 1) {
    return {
      name: "Home: нет дублирующего списка карты психологии",
      status: "pass",
      details: "PsychologyMap используется не более 1 раза на главной странице",
    };
  }

  return {
    name: "Home: нет дублирующего списка карты психологии",
    status: "fail",
    details: `PsychologyMap найден ${psychologyMapCount} раз(а) на главной странице`,
  };
}

export function checkMoreDropdownUnifiedStyle(): SiteCheck {
  const headerContent = readFileSafe(
    path.join(componentsDir, "site-header.tsx")
  );

  const hasDropdownTrigger = headerContent.includes("dropdown-trigger");
  const hasDropdownPanel = headerContent.includes("dropdown-panel");
  const hasDropdownItem = headerContent.includes("dropdown-item");

  if (hasDropdownTrigger && hasDropdownPanel && hasDropdownItem) {
    return {
      name: "MoreDropdown в едином стиле",
      status: "pass",
      details:
        "MoreDropdown использует классы dropdown-trigger, dropdown-panel, dropdown-item",
    };
  }

  const missing: string[] = [];
  if (!hasDropdownTrigger) missing.push("dropdown-trigger");
  if (!hasDropdownPanel) missing.push("dropdown-panel");
  if (!hasDropdownItem) missing.push("dropdown-item");

  return {
    name: "MoreDropdown в едином стиле",
    status: "fail",
    details: `Отсутствуют классы: ${missing.join(", ")}`,
  };
}

export function checkDisciplinesSwitchCentered(): SiteCheck {
  const explorerContent = readFileSafe(
    path.join(componentsDir, "disciplines-explorer.tsx")
  );

  const hasJustifyCenter = explorerContent.includes("sm:justify-center");
  const hasMxAuto = explorerContent.includes("mx-auto");
  const hasSmWFit = explorerContent.includes("sm:w-fit");

  if (hasJustifyCenter && hasMxAuto && hasSmWFit) {
    return {
      name: "Disciplines: переключатель центрирован",
      status: "pass",
      details:
        "Переключатель Бакалавриат/Магистратура центрирован (sm:justify-center, mx-auto, sm:w-fit)",
    };
  }

  const missing: string[] = [];
  if (!hasJustifyCenter) missing.push("sm:justify-center");
  if (!hasMxAuto) missing.push("mx-auto");
  if (!hasSmWFit) missing.push("sm:w-fit");

  return {
    name: "Disciplines: переключатель центрирован",
    status: "fail",
    details: `Отсутствуют классы центрирования: ${missing.join(", ")}`,
  };
}

export function checkDisciplinesCourseButtonsCentered(): SiteCheck {
  const explorerContent = readFileSafe(
    path.join(componentsDir, "disciplines-explorer.tsx")
  );

  const hasItemsCenter = explorerContent.includes("items-center");
  const hasFlexCol = explorerContent.includes("flex-col items-center");

  if (hasItemsCenter && hasFlexCol) {
    return {
      name: "Disciplines: кнопки курсов центрированы",
      status: "pass",
      details: "Контейнер кнопок курсов использует flex-col items-center",
    };
  }

  return {
    name: "Disciplines: кнопки курсов центрированы",
    status: "warn",
    details:
      "Не удалось подтвердить центрирование кнопок курсов (items-center/flex-col items-center)",
  };
}

export function checkDropdownTriggerHeight(): SiteCheck {
  const cssContent = readFileSafe(path.join(appDir, "globals.css"));

  const hasTriggerHeight =
    cssContent.includes("dropdown-trigger") &&
    (cssContent.includes("height: 44px") ||
      cssContent.includes("height:44px") ||
      cssContent.includes("min-height: 44px") ||
      cssContent.includes("min-height:44px"));

  if (hasTriggerHeight) {
    return {
      name: "Design: dropdown trigger height ≥ 44px",
      status: "pass",
      details: ".dropdown-trigger имеет height/min-height 44px в globals.css",
    };
  }

  return {
    name: "Design: dropdown trigger height ≥ 44px",
    status: "fail",
    details:
      ".dropdown-trigger не имеет height или min-height 44px в globals.css",
  };
}

export function checkBodyFontWeight500(): SiteCheck {
  const cssContent = readFileSafe(path.join(appDir, "globals.css"));

  const bodyHas500 = /body\s*\{[^}]*font-weight\s*:\s*50[05]/.test(cssContent);

  if (bodyHas500) {
    return {
      name: "Design: body font-weight ≥ 500",
      status: "pass",
      details: "body имеет font-weight: 500 в globals.css",
    };
  }

  return {
    name: "Design: body font-weight ≥ 500",
    status: "fail",
    details: "body не имеет font-weight: 500 в globals.css",
  };
}

export function checkArchiveNoKomnata220(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithPhrase: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (
      content.includes("комната 220") ||
      content.includes("Комната 220") ||
      content.includes("Комната №220")
    ) {
      filesWithPhrase.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithPhrase.length === 0) {
    return {
      name: "Archive: нет 'комната 220'",
      status: "pass",
      details: "Фраза 'комната 220' не найдена в коде",
    };
  }

  return {
    name: "Archive: нет 'комната 220'",
    status: "fail",
    details: `Найдена в ${filesWithPhrase.length} файлах: ${filesWithPhrase.join(", ")}`,
  };
}

export function checkArchiveAuditoria220Exists(): SiteCheck {
  const archiveFiles = [
    path.join(dataDir, "i18n", "ru.ts"),
    path.join(dataDir, "history.ts"),
    path.join(appDir, "history", "page.tsx"),
    path.join(appDir, "[lang]", "history", "page.tsx"),
    path.join(appDir, "archive", "page.tsx"),
    path.join(appDir, "[lang]", "archive", "page.tsx"),
    path.join(dataDir, "static-pages.ts"),
  ];

  const filesWithAuditoria: string[] = [];
  for (const file of archiveFiles) {
    const content = readFileSafe(file);
    if (
      content.includes("аудитория 220") ||
      content.includes("Аудитория 220") ||
      content.includes("Аудитория №220")
    ) {
      filesWithAuditoria.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithAuditoria.length > 0) {
    return {
      name: "Archive: есть 'аудитория 220'",
      status: "pass",
      details: `Фраза 'аудитория 220' найдена в ${filesWithAuditoria.length} файлах: ${filesWithAuditoria.join(", ")}`,
    };
  }

  return {
    name: "Archive: есть 'аудитория 220'",
    status: "fail",
    details: "Фраза 'аудитория 220' не найдена в archive/исторических файлах",
  };
}

export function checkArchiveNoPeredayushchieTraditsii(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithPhrase: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (content.includes("передающие традиции из поколения в поколение")) {
      filesWithPhrase.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithPhrase.length === 0) {
    return {
      name: "Archive: нет 'передающие традиции'",
      status: "pass",
      details:
        "Фраза 'передающие традиции из поколения в поколение' не найдена",
    };
  }

  return {
    name: "Archive: нет 'передающие традиции'",
    status: "fail",
    details: `Найдена в ${filesWithPhrase.length} файлах: ${filesWithPhrase.join(", ")}`,
  };
}

export function checkGlossaryNoDoPublikatsii(): SiteCheck {
  const glossaryFiles = [
    ...globFiles(path.join(dataDir, "i18n"), /\.ts$/),
    path.join(dataDir, "glossary.ts"),
    path.join(appDir, "glossary", "page.tsx"),
    path.join(appDir, "[lang]", "glossary", "page.tsx"),
    path.join(componentsDir, "glossary-client.tsx"),
  ];

  const filesWithPhrase: string[] = [];
  for (const file of glossaryFiles) {
    const content = readFileSafe(file);
    if (content.includes("до публикации")) {
      filesWithPhrase.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithPhrase.length === 0) {
    return {
      name: "Glossary: нет 'до публикации'",
      status: "pass",
      details: "Фраза 'до публикации' не найдена в glossary-файлах",
    };
  }

  return {
    name: "Glossary: нет 'до публикации'",
    status: "fail",
    details: `Найдена в ${filesWithPhrase.length} файлах: ${filesWithPhrase.join(", ")}`,
  };
}

export function checkGlossaryNoRoom220(): SiteCheck {
  const glossaryFiles = [
    ...globFiles(path.join(dataDir, "i18n"), /\.ts$/),
    path.join(dataDir, "glossary.ts"),
    path.join(appDir, "glossary", "page.tsx"),
    path.join(appDir, "[lang]", "glossary", "page.tsx"),
    path.join(componentsDir, "glossary-client.tsx"),
  ];

  const filesWithPhrase: string[] = [];
  for (const file of glossaryFiles) {
    const content = readFileSafe(file);
    if (
      content.includes("комната 220") ||
      content.includes("Комната 220") ||
      content.includes("Комната №220")
    ) {
      filesWithPhrase.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithPhrase.length === 0) {
    return {
      name: "Glossary: нет 'комната 220'",
      status: "pass",
      details: "Фраза 'комната 220' не найдена в glossary-файлах",
    };
  }

  return {
    name: "Glossary: нет 'комната 220'",
    status: "fail",
    details: `Найдена в ${filesWithPhrase.length} файлах: ${filesWithPhrase.join(", ")}`,
  };
}

export function checkGlossaryNoDuplicateSections(): SiteCheck {
  const glossaryPage = readFileSafe(path.join(appDir, "glossary", "page.tsx"));
  const langGlossaryPage = readFileSafe(
    path.join(appDir, "[lang]", "glossary", "page.tsx")
  );
  const glossaryClient = readFileSafe(
    path.join(componentsDir, "glossary-client.tsx")
  );

  const combined = glossaryPage + langGlossaryPage + glossaryClient;

  const relatedHeadingCount = (combined.match(/relatedHeading/g) || []).length;
  const relatedMaterialsCount = (combined.match(/relatedMaterials/g) || [])
    .length;
  const relatedCardsCount = (combined.match(/relatedCards/g) || []).length;

  if (
    relatedHeadingCount <= 1 &&
    relatedMaterialsCount <= 1 &&
    relatedCardsCount <= 2
  ) {
    return {
      name: "Glossary: нет дубля связанных разделов",
      status: "pass",
      details:
        "Связанные разделы глоссария не дублируются (1 блок relatedHeading + relatedCards)",
    };
  }

  return {
    name: "Glossary: нет дубля связанных разделов",
    status: "fail",
    details: `Найдено relatedHeading: ${relatedHeadingCount}, relatedMaterials: ${relatedMaterialsCount}, relatedCards: ${relatedCardsCount} — возможно дублирование`,
  };
}

export function getAllSiteChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];

  checks.push(checkImages());

  const h1Checks = checkH1();
  checks.push(...h1Checks);

  checks.push(checkSkipLink());
  checks.push(checkFocusVisible());
  checks.push(checkFooterUniversity());
  checks.push(checkFooterBySpw());

  const ogChecks = checkOGMetadata();
  checks.push(...ogChecks);

  const oldPhraseChecks = checkOldPhrases();
  checks.push(...oldPhraseChecks);

  checks.push(checkRootNoRedirect());
  checks.push(checkNo70plusTerms());
  checks.push(checkNoFirstPublication());
  checks.push(checkNoRoom220());
  checks.push(checkNo2025Default());
  checks.push(checkFakeContacts());

  const disciplineRouteChecks = checkDisciplineRoutes();
  checks.push(...disciplineRouteChecks);

  const disciplineProgramChecks = checkDisciplinePrograms();
  checks.push(...disciplineProgramChecks);

  const disciplineCourseCountChecks = checkDisciplineCourseCounts();
  checks.push(...disciplineCourseCountChecks);

  checks.push(checkNoMockDisciplines());
  checks.push(checkNoForbiddenSubjects());
  checks.push(checkNoSelectProgram());
  checks.push(checkNoBorderRadiusFull());
  checks.push(checkNoPsy());
  checks.push(checkPublicationsBadContent());
  checks.push(checkEnUIRussianLabels());
  checks.push(checkFakeContactsNames());

  checks.push(checkMainExists());
  checks.push(checkHeroNoOldTexts());
  checks.push(checkHomeTrendingCta());
  checks.push(checkHomeNoDuplicatePsychologyMap());
  checks.push(checkMoreDropdownUnifiedStyle());
  checks.push(checkDisciplinesSwitchCentered());
  checks.push(checkDisciplinesCourseButtonsCentered());
  checks.push(checkDropdownTriggerHeight());
  checks.push(checkBodyFontWeight500());
  checks.push(checkArchiveNoKomnata220());
  checks.push(checkArchiveAuditoria220Exists());
  checks.push(checkArchiveNoPeredayushchieTraditsii());
  checks.push(checkGlossaryNoDoPublikatsii());
  checks.push(checkGlossaryNoRoom220());
  checks.push(checkGlossaryNoDuplicateSections());

  const responsiveChecks = getResponsiveChecks();
  checks.push(...responsiveChecks);

  const internalBugsChecks = getInternalBugsChecks();
  checks.push(...internalBugsChecks);

  const performanceChecks = getPerformanceChecks();
  checks.push(...performanceChecks);

  const loadingChecks = getLoadingChecks();
  checks.push(...loadingChecks);

  const visualPolishChecks = getVisualPolishChecks();
  checks.push(...visualPolishChecks);

  const vercelReadinessChecks = getVercelReadinessChecks();
  checks.push(...vercelReadinessChecks);

  return checks;
}

export function checkRootNoRedirect(): SiteCheck {
  const middlewareContent = readFileSafe(
    path.join(process.cwd(), "middleware.ts")
  );

  const hasRootPassthrough =
    middlewareContent.includes('pathname === "/"') &&
    middlewareContent.includes("NextResponse.next()") &&
    middlewareContent.includes("DEFAULT_LANG");

  if (hasRootPassthrough) {
    return {
      name: "/ не редиректит на /en",
      status: "pass",
      details:
        "Middleware пропускает / без редиректа, DEFAULT_LANG = ru, / не редиректит на /en",
    };
  }

  return {
    name: "/ не редиректит на /en",
    status: "fail",
    details: "Middleware не содержит блок пропуска корневого пути",
  };
}

export function checkRoutesExist(): SiteCheck {
  const contactsPage = path.join(appDir, "contacts", "page.tsx");
  const disciplinesPage = path.join(appDir, "disciplines", "page.tsx");
  const contactsExists = fs.existsSync(contactsPage);
  const disciplinesExists = fs.existsSync(disciplinesPage);

  const missing: string[] = [];
  if (!contactsExists) missing.push("/contacts");
  if (!disciplinesExists) missing.push("/disciplines");

  if (missing.length === 0) {
    return {
      name: "/contacts и /disciplines существуют",
      status: "pass",
      details:
        "Страницы /contacts (app/contacts/page.tsx) и /disciplines (app/disciplines/page.tsx) существуют",
    };
  }

  return {
    name: "/contacts и /disciplines существуют",
    status: "fail",
    details: `Отсутствуют страницы: ${missing.join(", ")}`,
  };
}

export function checkNoSecondHeader(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithMultipleHeaders: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const headerMatches = content.match(/<header[\s>]/gi);
    if (headerMatches && headerMatches.length > 1) {
      const relative = path.relative(process.cwd(), file);
      filesWithMultipleHeaders.push(relative);
    }
  }

  if (filesWithMultipleHeaders.length === 0) {
    return {
      name: "Нет второго header",
      status: "pass",
      details: "Ни один файл не содержит более одного тега <header>",
    };
  }

  return {
    name: "Нет второго header",
    status: "fail",
    details: `Найдено ${filesWithMultipleHeaders.length} файлов с >1 <header>: ${filesWithMultipleHeaders.join(", ")}`,
  };
}

export function checkNo70plusTerms(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWith70plus: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (content.includes("70+") || content.includes("70 +")) {
      const relative = path.relative(process.cwd(), file);
      filesWith70plus.push(relative);
    }
  }

  if (filesWith70plus.length === 0) {
    return {
      name: "Нет '70+ terms'",
      status: "pass",
      details: "Фраза '70+' не найдена (заменена на '200+')",
    };
  }

  return {
    name: "Нет '70+ terms'",
    status: "fail",
    details: `Найдена в ${filesWith70plus.length} файлах: ${filesWith70plus.join(", ")}`,
  };
}

export function checkNoFirstPublication(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithPhrase: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (
      content.includes("first publication") ||
      content.includes("first.publication") ||
      content.includes("первая публикация")
    ) {
      const relative = path.relative(process.cwd(), file);
      filesWithPhrase.push(relative);
    }
  }

  if (filesWithPhrase.length === 0) {
    return {
      name: "Нет 'first publication'",
      status: "pass",
      details: "Фраза 'first publication' не найдена",
    };
  }

  return {
    name: "Нет 'first publication'",
    status: "fail",
    details: `Найдена в ${filesWithPhrase.length} файлах: ${filesWithPhrase.join(", ")}`,
  };
}

export function checkNoRoom220(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithRoom220: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (content.includes("Комната №220") || content.includes("Комната 220")) {
      const relative = path.relative(process.cwd(), file);
      filesWithRoom220.push(relative);
    }
  }

  if (filesWithRoom220.length === 0) {
    return {
      name: "Нет 'Комната №220'",
      status: "pass",
      details: "Фраза 'Комната №220' не найдена (должно быть 'Аудитория №220')",
    };
  }

  return {
    name: "Нет 'Комната №220'",
    status: "fail",
    details: `Найдена в ${filesWithRoom220.length} файлах: ${filesWithRoom220.join(", ")}`,
  };
}

export function checkNo2025Default(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWith2025Default: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (
      content.includes("© 2025") ||
      content.includes("2025 года") ||
      content.includes("2025 год") ||
      content.includes('"2025"') ||
      content.includes("'2025'")
    ) {
      const relative = path.relative(process.cwd(), file);
      filesWith2025Default.push(relative);
    }
  }

  if (filesWith2025Default.length === 0) {
    return {
      name: "Нет '2025' как дефолтного",
      status: "pass",
      details:
        "2025 не используется как дефолтный год (копирайт, тексты). Актуальный: 2026",
    };
  }

  return {
    name: "Нет '2025' как дефолтного",
    status: "fail",
    details: `Найдено в ${filesWith2025Default.length} файлах: ${filesWith2025Default.join(", ")}`,
  };
}

export function checkFakeContacts(): SiteCheck {
  const contactsContent = readFileSafe(path.join(dataDir, "official-links.ts"));

  const allowedPhones = [
    "+998 (71) 232-28-11",
    "+998 (71) 232-28-01",
    "+998 (71) 233-58-26",
    "+998 (71) 232-28-22",
    "+998 (71) 233-87-88",
    "+998 (71) 236-30-60",
    "+998 (71) 232-07-33",
    "+998 (71) 232-28-10",
  ];

  const allowedEmails = ["info@msu.uz", "msu@exat.uz"];

  const phoneRegex = /\+\d[\d\s() -]{7,}\d/g;
  const emailRegex = /[\w.+-]+@[\w-]+\.[\w.]+/g;

  const foundPhones = contactsContent.match(phoneRegex) || [];
  const foundEmails = contactsContent.match(emailRegex) || [];

  const suspiciousPhones = foundPhones.filter(
    (p) => !allowedPhones.includes(p)
  );
  const suspiciousEmails = foundEmails.filter(
    (e) => !allowedEmails.includes(e)
  );

  if (suspiciousPhones.length === 0 && suspiciousEmails.length === 0) {
    return {
      name: "Нет выдуманных контактов",
      status: "pass",
      details:
        "Все контакты в official-links.ts соответствуют официальным данным ТФ МГУ",
    };
  }

  const details: string[] = [];
  if (suspiciousPhones.length > 0)
    details.push(`телефоны: ${suspiciousPhones.join(", ")}`);
  if (suspiciousEmails.length > 0)
    details.push(`email: ${suspiciousEmails.join(", ")}`);

  return {
    name: "Нет выдуманных контактов",
    status: "fail",
    details: `Найдены подозрительные контакты: ${details.join("; ")}`,
  };
}

// ── Проверки дисциплин ──────────────────────────────────────────────

export function checkDisciplineRoutes(): SiteCheck[] {
  const checks: SiteCheck[] = [];

  const rootExists = fs.existsSync(
    path.join(appDir, "disciplines", "page.tsx")
  );
  const langExists = fs.existsSync(
    path.join(appDir, "[lang]", "disciplines", "page.tsx")
  );

  checks.push({
    name: "/disciplines существует",
    status: rootExists ? "pass" : "fail",
    details: rootExists
      ? "Страница /disciplines (app/disciplines/page.tsx) существует"
      : "Страница /disciplines (app/disciplines/page.tsx) не найдена",
  });

  const langStatus = langExists ? "pass" : "fail";
  checks.push({
    name: "/en/disciplines существует",
    status: langStatus,
    details: langExists
      ? "Страница /en/disciplines (app/[lang]/disciplines/page.tsx) существует"
      : "Страница /en/disciplines не найдена",
  });
  checks.push({
    name: "/uz/disciplines существует",
    status: langStatus,
    details: langExists
      ? "Страница /uz/disciplines (app/[lang]/disciplines/page.tsx) существует"
      : "Страница /uz/disciplines не найдена",
  });

  return checks;
}

export function checkDisciplinePrograms(): SiteCheck[] {
  const checks: SiteCheck[] = [];

  const bachelor = disciplinesData.find((d) => d.level === "bachelor");
  const master = disciplinesData.find((d) => d.level === "master");

  // Бакалавриат содержит 4 курса
  const bachelorCourseCount = bachelor?.courses.length ?? 0;
  checks.push({
    name: "Бакалавриат содержит 4 курса",
    status: bachelorCourseCount === 4 ? "pass" : "fail",
    details:
      bachelorCourseCount === 4
        ? "Бакалавриат имеет 4 курса"
        : `Бакалавриат имеет ${bachelorCourseCount} курсов (ожидалось 4)`,
  });

  // Магистратура содержит 2 курса
  const masterCourseCount = master?.courses.length ?? 0;
  checks.push({
    name: "Магистратура содержит 2 курса",
    status: masterCourseCount === 2 ? "pass" : "fail",
    details:
      masterCourseCount === 2
        ? "Магистратура имеет 2 курса"
        : `Магистратура имеет ${masterCourseCount} курсов (ожидалось 2)`,
  });

  // Нет спортивной магистратуры
  const hasSportMaster = disciplinesData.some(
    (d) =>
      d.level === "master" &&
      (d.profile.toLowerCase().includes("спортив") ||
        d.profile.toLowerCase().includes("sport"))
  );
  checks.push({
    name: "Нет спортивной магистратуры",
    status: hasSportMaster ? "fail" : "pass",
    details: hasSportMaster
      ? "Найдена магистратура, связанная со спортом"
      : "Спортивная магистратура отсутствует",
  });

  // Нет магистратуры 'Социальная психология'
  const hasSocialPsychMaster = disciplinesData.some(
    (d) => d.level === "master" && d.profile.includes("Социальная психология")
  );
  checks.push({
    name: "Нет магистратуры 'Социальная психология'",
    status: hasSocialPsychMaster ? "fail" : "pass",
    details: hasSocialPsychMaster
      ? "Магистратура 'Социальная психология' присутствует в данных"
      : "Магистратура 'Социальная психология' отсутствует (корректно)",
  });

  return checks;
}

export function checkDisciplineCourseCounts(): SiteCheck[] {
  const checks: SiteCheck[] = [];

  const bachelor = disciplinesData.find((d) => d.level === "bachelor");
  const master = disciplinesData.find((d) => d.level === "master");

  const expectedBachelor: [number, number][] = [
    [1, 22],
    [2, 23],
    [3, 21],
    [4, 21],
  ];
  const expectedMaster: [number, number][] = [
    [1, 19],
    [2, 16],
  ];

  for (const [course, expected] of expectedBachelor) {
    const actual = bachelor?.courses.find((c) => c.course === course)?.subjects
      .length;
    checks.push({
      name: `Бакалавриат курс ${course} = ${expected} предметов`,
      status: actual === expected ? "pass" : "fail",
      details:
        actual === expected
          ? `Курс ${course}: ${actual} предметов`
          : `Курс ${course}: ${actual ?? 0} предметов (ожидалось ${expected})`,
    });
  }

  for (const [course, expected] of expectedMaster) {
    const actual = master?.courses.find((c) => c.course === course)?.subjects
      .length;
    checks.push({
      name: `Магистратура курс ${course} = ${expected} предметов`,
      status: actual === expected ? "pass" : "fail",
      details:
        actual === expected
          ? `Курс ${course}: ${actual} предметов`
          : `Курс ${course}: ${actual ?? 0} предметов (ожидалось ${expected})`,
    });
  }

  return checks;
}

export function checkNoMockDisciplines(): SiteCheck {
  const tsxFiles = [
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithMock: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (content.includes("mockDisciplines")) {
      filesWithMock.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithMock.length === 0) {
    return {
      name: "Нет mockDisciplines",
      status: "pass",
      details: "mockDisciplines не используется в исходном коде",
    };
  }

  return {
    name: "Нет mockDisciplines",
    status: "fail",
    details: `mockDisciplines найден в ${filesWithMock.length} файлах: ${filesWithMock.join(", ")}`,
  };
}

export function checkNoForbiddenSubjects(): SiteCheck {
  const forbiddenFound: { subject: string; location: string }[] = [];

  for (const program of disciplinesData) {
    const levelLabel =
      program.level === "bachelor" ? "Бакалавриат" : "Магистратура";
    for (const course of program.courses) {
      for (const subject of course.subjects) {
        if (FORBIDDEN_SUBJECTS.includes(subject)) {
          forbiddenFound.push({
            subject: subject,
            location: `${levelLabel} / ${program.title} / ${course.course} курс`,
          });
        }
      }
    }
  }

  if (forbiddenFound.length === 0) {
    return {
      name: "Нет запрещённых предметов",
      status: "pass",
      details: "Запрещённые предметы отсутствуют в данных дисциплин",
    };
  }

  return {
    name: "Нет запрещённых предметов",
    status: "fail",
    details: `Найдено ${forbiddenFound.length} запрещённых предметов: ${forbiddenFound.map((f) => `${f.subject} (${f.location})`).join("; ")}`,
  };
}

export function checkNoSelectProgram(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithSelectProgram: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    if (
      /<select[\s>][^>]*>[^<]*Программа/i.test(content) ||
      /<option[^>]*>Программа<\/option>/i.test(content)
    ) {
      filesWithSelectProgram.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithSelectProgram.length === 0) {
    return {
      name: "Нет select 'Программа'",
      status: "pass",
      details: "Элемент <select> с опцией 'Программа' не найден",
    };
  }

  return {
    name: "Нет select 'Программа'",
    status: "fail",
    details: `Найден в ${filesWithSelectProgram.length} файлах: ${filesWithSelectProgram.join(", ")}`,
  };
}

// ── Новые Content Health проверки ────────────────────────────────────

export function checkBurgerDesktopHidden(): SiteCheck {
  const headerContent = readFileSafe(
    path.join(componentsDir, "site-header.tsx")
  );

  const hasLgHidden = headerContent.includes("lg:hidden");
  const hasBurgerAria = headerContent.includes('aria-label="Меню"');
  const hasBurgerButton = headerContent.includes("<button") && hasBurgerAria;

  if (hasBurgerButton && hasLgHidden) {
    return {
      name: "Burger не виден на desktop",
      status: "pass",
      details: "Burger-кнопка скрыта на desktop через lg:hidden",
    };
  }

  if (!hasBurgerButton) {
    return {
      name: "Burger не виден на desktop",
      status: "fail",
      details: "Burger-кнопка (aria-label='Меню') не найдена в site-header.tsx",
    };
  }

  return {
    name: "Burger не виден на desktop",
    status: "fail",
    details: "Burger-кнопка не имеет lg:hidden (отображается на desktop)",
  };
}

export function checkBurgerMobileVisible(): SiteCheck {
  const headerContent = readFileSafe(
    path.join(componentsDir, "site-header.tsx")
  );

  const burgerButtonMatch = headerContent.match(
    /<button[^>]*aria-label="Меню"[^>]*>/i
  );

  if (!burgerButtonMatch) {
    return {
      name: "Burger виден на mobile",
      status: "fail",
      details: "Burger-кнопка (aria-label='Меню') не найдена в site-header.tsx",
    };
  }

  const burgerHtml = burgerButtonMatch[0];
  const hasBaseHidden = /[^a-z-]hidden[\s"]/.test(burgerHtml);
  const hasLgHiddenClass = burgerHtml.includes("lg:hidden");

  if (hasLgHiddenClass && !hasBaseHidden) {
    return {
      name: "Burger виден на mobile",
      status: "pass",
      details:
        "Burger-кнопка скрыта только на desktop (lg:hidden), видна на mobile",
    };
  }

  if (hasBaseHidden) {
    return {
      name: "Burger виден на mobile",
      status: "fail",
      details:
        "Burger-кнопка скрыта на всех разрешениях (есть hidden без lg: префикса)",
    };
  }

  return {
    name: "Burger виден на mobile",
    status: "warn",
    details: "Burger-кнопка может быть некорректно настроена для mobile",
  };
}

export function checkNoHeaderAfterFooter(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithIssue: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const lastFooterIdx = content.lastIndexOf("<footer");
    const firstHeaderIdx = content.indexOf("<header");
    if (
      lastFooterIdx !== -1 &&
      firstHeaderIdx !== -1 &&
      lastFooterIdx < firstHeaderIdx
    ) {
      filesWithIssue.push(path.relative(process.cwd(), file));
    }
    const lastHeaderIdx = content.lastIndexOf("<header");
    if (
      lastFooterIdx !== -1 &&
      lastHeaderIdx !== -1 &&
      lastHeaderIdx > lastFooterIdx
    ) {
      filesWithIssue.push(path.relative(process.cwd(), file));
    }
  }

  const uniqueFiles = [...new Set(filesWithIssue)];

  if (uniqueFiles.length === 0) {
    return {
      name: "Нет второго header после footer",
      status: "pass",
      details: "Во всех файлах <header> расположен до <footer>",
    };
  }

  return {
    name: "Нет второго header после footer",
    status: "fail",
    details: `Найден <header> после <footer> в: ${uniqueFiles.join(", ")}`,
  };
}

export function checkNoBorderRadiusFull(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithIssue: { file: string; element: string }[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);

    const btnMatch = content.match(
      /<(button|nav|select)[\s>][^]*?rounded-full[^]*?\/?>/gi
    );
    if (btnMatch) {
      for (const match of btnMatch) {
        if (
          /<(button|nav|select)[\s>]/i.test(match) &&
          /rounded-full/i.test(match)
        ) {
          filesWithIssue.push({
            file: relative,
            element: match.slice(0, 60),
          });
          break;
        }
      }
    }

    if (
      /border-radius\s*:\s*9999?px/i.test(content) &&
      /<(button|nav|select)/i.test(content)
    ) {
      filesWithIssue.push({
        file: relative,
        element: "border-radius: 9999px или 999px",
      });
    }
  }

  if (filesWithIssue.length === 0) {
    return {
      name: "Нет border-radius 999px на button/nav/select",
      status: "pass",
      details:
        "rounded-full и border-radius: 9999px не используются на button/nav/select",
    };
  }

  return {
    name: "Нет border-radius 999px на button/nav/select",
    status: "warn",
    details: `Найдено ${filesWithIssue.length} случаев: ${filesWithIssue.map((f) => `${f.file} (${f.element})`).join("; ")}`,
  };
}

export function checkNoPsy(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithPsy: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);

    if (
      /["'`>]\s*PSY\s*["'`<]/i.test(content) ||
      /["'`>]\s*[Pp][Ss][Yy]\s*["'`<]/.test(content) ||
      /\bPSY\b/.test(content)
    ) {
      const hasPsychology = /психологи/i.test(content);
      const hasTelegram = /t\.me\/psy/i.test(content);
      const hasPsi = /Ψ/i.test(content);

      if (!hasPsychology && !hasTelegram && !hasPsi) {
        filesWithPsy.push(relative);
      }
    }
  }

  if (filesWithPsy.length === 0) {
    return {
      name: "Нет слова PSY/psy",
      status: "pass",
      details:
        "Слово 'PSY' или 'psy' как бренд/логотип не найдено в исходном коде",
    };
  }

  return {
    name: "Нет слова PSY/psy",
    status: "warn",
    details: `Найдено 'PSY'/'psy' в ${filesWithPsy.length} файлах: ${filesWithPsy.join(", ")}`,
  };
}

export function checkDropdownMinHeight(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithDropdownIssue: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);

    const dropdownElements =
      content.match(/role="(menu|listbox)"[\s\S]*?\/?>/gi) || [];

    for (const el of dropdownElements) {
      const hasMinHeight = /min-h/i.test(el) || /min-height/i.test(el);
      if (!hasMinHeight && el.length > 20) {
        filesWithDropdownIssue.push(relative);
        break;
      }
    }
  }

  if (filesWithDropdownIssue.length === 0) {
    return {
      name: "Dropdown имеет min-height 44px",
      status: "pass",
      details: "Все dropdown-элементы (role=menu/listbox) имеют min-height",
    };
  }

  return {
    name: "Dropdown имеет min-height 44px",
    status: "warn",
    details: `Dropdown без min-height в: ${filesWithDropdownIssue.join(", ")}`,
  };
}

export function checkInputSelectFontSize(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithSmallFont: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);

    const inputSelectRegex = /<(input|select)[\s>][^]*?\/?>/gi;
    let match: RegExpExecArray | null;
    while ((match = inputSelectRegex.exec(content)) !== null) {
      const html = match[0];
      const hasSmallFont =
        /text-xs/.test(html) ||
        /text-sm/.test(html) ||
        /font-size:\s*1[0-4]px/.test(html) ||
        /font-size:\s*0\.\d/.test(html);
      const hasAdequateFont =
        /text-base/.test(html) ||
        /text-lg/.test(html) ||
        /font-size:\s*1[6-9]/.test(html) ||
        /font-size:\s*2\d/.test(html);
      const isSearchType = /type=["']search["']/i.test(html);

      if (
        !isSearchType &&
        (hasSmallFont || (!hasAdequateFont && html.length > 20))
      ) {
        filesWithSmallFont.push(relative);
        break;
      }
    }
  }

  if (filesWithSmallFont.length === 0) {
    return {
      name: "Select/input font-size >= 16px",
      status: "pass",
      details:
        "Все <input> и <select> используют font-size >= 16px или отсутствуют",
    };
  }

  return {
    name: "Select/input font-size >= 16px",
    status: "warn",
    details: `Проверьте font-size input/select в: ${filesWithSmallFont.join(", ")}`,
  };
}

export function checkHighContrastHidesBackground(): SiteCheck {
  const cssContent = readFileSafe(path.join(appDir, "globals.css"));

  const hasHighContrastRule =
    cssContent.includes('[data-theme="high-contrast"]') &&
    cssContent.includes("data-decor") &&
    cssContent.includes("display: none") &&
    cssContent.includes('[data-decor="true"]');

  if (hasHighContrastRule) {
    return {
      name: "High contrast скрывает background",
      status: "pass",
      details:
        "Декоративные элементы (data-decor) скрываются в high-contrast режиме через CSS",
    };
  }

  return {
    name: "High contrast скрывает background",
    status: "fail",
    details:
      "Правило [data-theme='high-contrast'] [data-decor='true'] { display: none } не найдено в globals.css",
  };
}

// ── Новые Content Health проверки ────────────────────────────────────

export function checkPublicationsBadContent(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const filesWithBadContent: { file: string; found: string }[] = [];

  const badPatterns: { pattern: RegExp; label: string }[] = [
    { pattern: /\uFFFD/g, label: "�" },
    { pattern: /новостимгу/gi, label: "новостимгу" },
    { pattern: /Сессия-это/gi, label: "Сессия-это" },
  ];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    for (const { pattern, label } of badPatterns) {
      if (pattern.test(content)) {
        filesWithBadContent.push({ file: relative, found: label });
        break;
      }
    }
  }

  if (filesWithBadContent.length === 0) {
    return {
      name: "Публикации: нет �, новостимгу, 'Сессия-это'",
      status: "pass",
      details: "Проблемный контент не найден в исходных файлах",
    };
  }

  return {
    name: "Публикации: нет �, новостимгу, 'Сессия-это'",
    status: "fail",
    details: `Найдено в ${filesWithBadContent.length} файлах: ${filesWithBadContent.map((f) => `${f.file} (${f.found})`).join("; ")}`,
  };
}

export function checkEnUIRussianLabels(): SiteCheck {
  const enContent = readFileSafe(path.join(dataDir, "i18n", "en.ts"));

  const enStrings = enContent.match(/["']([^"']{3,})["']/g) || [];

  const ruWordsPattern = /[А-Яа-яЁё]{4,}/;
  const russianInEn: string[] = [];

  for (const s of enStrings) {
    if (
      ruWordsPattern.test(s) &&
      !s.includes("siteNotice") &&
      !s.includes("Room") &&
      !s.includes("Andreyeva") &&
      !s.includes("Bazarov")
    ) {
      const clean = s.replace(/["']/g, "");
      if (clean !== "220") {
        russianInEn.push(clean.slice(0, 60));
      }
    }
  }

  if (russianInEn.length <= 2) {
    return {
      name: "EN UI без русских label вне notice",
      status: "pass",
      details:
        "Английский UI не содержит русских строк или только допустимые (имена/названия)",
    };
  }

  return {
    name: "EN UI без русских label вне notice",
    status: "warn",
    details: `Найдено ${russianInEn.length} русских строк в en.ts вне siteNotice: ${russianInEn.join("; ")}`,
  };
}

export function checkFakeContactsNames(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(dataDir, /\.ts$/),
    ...globFiles(libDir, /\.ts$/),
  ];

  const fakeNames = ["Приёмная комиссия", "Учебный отдел", "Вахта", "Факс"];

  const filesWithFakeNames: { file: string; name: string }[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    for (const name of fakeNames) {
      if (content.includes(name)) {
        filesWithFakeNames.push({ file: relative, name });
        break;
      }
    }
  }

  if (filesWithFakeNames.length === 0) {
    return {
      name: "Контакты: нет выдуманных названий",
      status: "pass",
      details:
        "'Приёмная комиссия', 'Учебный отдел', 'Вахта', 'Факс' не найдены",
    };
  }

  return {
    name: "Контакты: нет выдуманных названий",
    status: "fail",
    details: `Найдено в ${filesWithFakeNames.length} файлах: ${filesWithFakeNames.map((f) => `${f.file} (${f.name})`).join("; ")}`,
  };
}

// ── Responsive checks ──────────────────────────────────────────────

export function checkFooterCount(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithFooter: string[] = [];
  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const footerMatches = content.match(/<footer[\s>]/gi);
    if (footerMatches && footerMatches.length > 0) {
      filesWithFooter.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithFooter.length === 1) {
    return {
      name: "Footer один",
      status: "pass",
      details: `Ровно один <footer> найден в: ${filesWithFooter[0]}`,
    };
  }

  if (filesWithFooter.length === 0) {
    return {
      name: "Footer один",
      status: "fail",
      details: "<footer> не найден ни в одном файле",
    };
  }

  return {
    name: "Footer один",
    status: "warn",
    details: `<footer> найден в ${filesWithFooter.length} файлах: ${filesWithFooter.join(", ")}`,
  };
}

export function checkOverflowXOnBody(): SiteCheck {
  const cssContent = readFileSafe(path.join(appDir, "globals.css"));
  const htmlHasOverflowX = /html\s*\{[^}]*overflow-x:\s*hidden/i.test(
    cssContent
  );
  const bodyHasOverflowX = /body\s*\{[^}]*overflow-x:\s*hidden/i.test(
    cssContent
  );

  if (htmlHasOverflowX && bodyHasOverflowX) {
    return {
      name: "overflow-x: hidden на body-level",
      status: "pass",
      details: "html и body имеют overflow-x: hidden в globals.css",
    };
  }

  const missing: string[] = [];
  if (!htmlHasOverflowX) missing.push("html");
  if (!bodyHasOverflowX) missing.push("body");

  return {
    name: "overflow-x: hidden на body-level",
    status: "fail",
    details: `Отсутствует overflow-x: hidden на: ${missing.join(", ")}`,
  };
}

export function checkResponsiveGrids(): SiteCheck[] {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const nonResponsiveGrids: { file: string; className: string }[] = [];

  const gridPattern = /grid-cols-\d+/g;

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    let match: RegExpExecArray | null;
    while ((match = gridPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const before = content.slice(Math.max(0, match.index - 10), match.index);
      const hasResponsivePrefix = /(sm|md|lg|xl|2xl):\s*$/.test(before);
      if (!hasResponsivePrefix && !relative.includes("debug/")) {
        nonResponsiveGrids.push({ file: relative, className: fullMatch });
      }
    }
  }

  if (nonResponsiveGrids.length === 0) {
    return [
      {
        name: "Grids используют responsive шаблоны",
        status: "pass",
        details: "Все grid-cols-* имеют responsive префиксы (sm:, md:, lg:)",
      },
    ];
  }

  const grouped = new Map<string, string[]>();
  for (const g of nonResponsiveGrids) {
    if (!grouped.has(g.file)) grouped.set(g.file, []);
    grouped.get(g.file)!.push(g.className);
  }

  const details = Array.from(grouped.entries())
    .map(([file, classes]) => `${file} (${classes.join(", ")})`)
    .join("; ");

  return [
    {
      name: "Grids используют responsive шаблоны",
      status: "warn",
      details: `Найдено ${nonResponsiveGrids.length} grid-cols-* без responsive-префикса: ${details}`,
    },
  ];
}

export function checkButtonMinHeight(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithSmallButtons: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    const buttonRegex = /<button[\s>][^]*?\/?>/gi;
    let match: RegExpExecArray | null;
    while ((match = buttonRegex.exec(content)) !== null) {
      const buttonHtml = match[0];
      const hasMinHeight =
        /min-h[^"]/.test(buttonHtml) || /min-height/.test(buttonHtml);
      const hasHeight44 =
        /h[-[]\[?1[01]\]?/.test(buttonHtml) || /h[-[]\[?44/.test(buttonHtml);
      if (!hasMinHeight && !hasHeight44) {
        const isIconButton =
          /aria-label/i.test(buttonHtml) && !buttonHtml.includes(">");
        if (!isIconButton && buttonHtml.length > 30) {
          filesWithSmallButtons.push(relative);
          break;
        }
      }
    }
  }

  if (filesWithSmallButtons.length === 0) {
    return {
      name: "Кнопки min-height >= 44px",
      status: "pass",
      details:
        "Все <button> элементы имеют достаточную высоту (min-height >= 44px)",
    };
  }

  return {
    name: "Кнопки min-height >= 44px",
    status: "warn",
    details: `Потенциально маленькие кнопки в ${filesWithSmallButtons.length} файлах: ${filesWithSmallButtons.join(", ")}`,
  };
}

export function checkSearchInputFontSize(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const searchInputs: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (
      /type=["']search["']/i.test(content) &&
      !/(text-(sm|base|lg)|font-size)/i.test(content)
    ) {
      searchInputs.push(relative);
    }
  }

  if (searchInputs.length === 0) {
    return {
      name: "Search inputs font-size >= 16px",
      status: "pass",
      details:
        "Поисковые input-ы используют адекватный font-size или отсутствуют",
    };
  }

  return {
    name: "Search inputs font-size >= 16px",
    status: "warn",
    details: `Проверьте font-size search input-ов в: ${searchInputs.join(", ")}`,
  };
}

export function checkDecorativeAriaHidden(): SiteCheck {
  const bauhausFiles = [
    path.join(componentsDir, "psychology-bauhaus-background.tsx"),
    path.join(componentsDir, "bauhaus-decor.tsx"),
    path.join(componentsDir, "bauhaus-cover.tsx"),
  ];

  const filesMissingAriaHidden: string[] = [];
  for (const file of bauhausFiles) {
    const content = readFileSafe(file);
    if (!content) continue;
    const relative = path.relative(process.cwd(), file);
    const decorDivs = content.match(/<div[\s>][^]*?\/?>/gi) || [];
    const decorativeDivs = decorDivs.filter(
      (d) =>
        d.includes("decor") || d.includes("bauhaus") || d.includes("psi-decor")
    );
    const missingAria = decorativeDivs.some((d) => !d.includes("aria-hidden"));
    if (missingAria) {
      filesMissingAriaHidden.push(relative);
    }
  }

  if (filesMissingAriaHidden.length === 0) {
    return {
      name: "Декоративные background имеют aria-hidden",
      status: "pass",
      details: "Все декоративные элементы Bauhaus помечены aria-hidden=true",
    };
  }

  return {
    name: "Декоративные background имеют aria-hidden",
    status: "warn",
    details: `Найдены декоративные элементы без aria-hidden в: ${filesMissingAriaHidden.join(", ")}`,
  };
}

export function checkNoFixedWidthOver100vw(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithWideWidth: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    const widePattern = /width[:\s]+\d{5,}px/i;
    const wideTailwind = /w-\[?\d{3,}px\]?/;
    if (widePattern.test(content) || wideTailwind.test(content)) {
      filesWithWideWidth.push(relative);
    }
  }

  if (filesWithWideWidth.length === 0) {
    return {
      name: "Нет fixed width > 100vw",
      status: "pass",
      details: "Fixed width больше 100vw не найдены",
    };
  }

  return {
    name: "Нет fixed width > 100vw",
    status: "warn",
    details: `Потенциально широкие width в: ${filesWithWideWidth.join(", ")}`,
  };
}

export function checkNoMinWidth1000px(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];

  const filesWithMinWidth: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (
      /min-width:\s*1000px/i.test(content) ||
      /min-width:\s*\d{4,}px/i.test(content) ||
      /min-w-\[?\d{4,}px\]?/.test(content) ||
      /min-w-\[?\d{3,4}px\]?/.test(content)
    ) {
      filesWithMinWidth.push(relative);
    }
  }

  if (filesWithMinWidth.length === 0) {
    return {
      name: "Нет min-width: 1000px на контейнерах",
      status: "pass",
      details: "min-width: 1000px и большие min-width не найдены",
    };
  }

  return {
    name: "Нет min-width: 1000px на контейнерах",
    status: "warn",
    details: `Найдены контейнеры с min-width >= 1000px в: ${filesWithMinWidth.join(", ")}`,
  };
}

export function checkEnUzLayout(): SiteCheck[] {
  const langDir = path.join(appDir, "[lang]");

  const requiredRoutes = [
    "page.tsx",
    "layout.tsx",
    "contacts/page.tsx",
    "disciplines/page.tsx",
    "publications/page.tsx",
    "glossary/page.tsx",
  ];

  const missing: string[] = [];
  for (const route of requiredRoutes) {
    const fullPath = path.join(langDir, route);
    if (!fs.existsSync(fullPath)) {
      missing.push(route);
    }
  }

  const checks: SiteCheck[] = [];

  if (missing.length === 0) {
    checks.push({
      name: "/en и /uz версии не ломают layout",
      status: "pass",
      details:
        "Все ключевые [lang] роуты существуют: " + requiredRoutes.join(", "),
    });
  } else {
    checks.push({
      name: "/en и /uz версии не ломают layout",
      status: "fail",
      details: `Отсутствуют роуты: ${missing.join(", ")}`,
    });
  }

  return checks;
}

export function getResponsiveChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];

  checks.push(checkNoSecondHeader());
  checks.push(checkFooterCount());
  checks.push(checkBurgerDesktopHidden());
  checks.push(checkBurgerMobileVisible());
  checks.push(checkNoHeaderAfterFooter());
  checks.push(checkOverflowXOnBody());
  checks.push(...checkResponsiveGrids());
  checks.push(checkButtonMinHeight());
  checks.push(checkDropdownMinHeight());
  checks.push(checkSearchInputFontSize());
  checks.push(checkInputSelectFontSize());
  checks.push(checkBurgerAriaLabel());
  checks.push(checkDecorativeAriaHidden());
  checks.push(checkHighContrastHidesBackground());
  checks.push(checkNoFixedWidthOver100vw());
  checks.push(checkNoMinWidth1000px());
  checks.push(checkRoutesExist());
  checks.push(...checkEnUzLayout());

  return checks;
}

/* ───── Internal bugs ───── */

export function checkNoConsoleLogInProduction(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];
  const filesWithLog: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    const logMatches = content.match(/console\.(log|warn)\(/g);
    if (logMatches && logMatches.length > 0) {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (
          /console\.(log|warn)\(/.test(lines[i]) &&
          !lines[i].includes("NODE_ENV") &&
          !lines[i].includes("// ")
        ) {
          filesWithLog.push(`${relative}:${i + 1}`);
        }
      }
    }
  }

  if (filesWithLog.length === 0) {
    return {
      name: "console.log/warn в клиентском коде",
      status: "pass",
      details: "console.log/warn в клиентских файлах не найдены",
    };
  }

  return {
    name: "console.log/warn в клиентском коде",
    status: "warn",
    details: `Найдены: ${filesWithLog.join(", ")}`,
  };
}

export function checkNoModuleLevelLocalStorage(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];
  const filesWithIssue: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (
      !content.includes('"use client"') &&
      !content.includes("'use client'")
    ) {
      continue;
    }
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        /localStorage\.(getItem|setItem|removeItem)/.test(line) &&
        !line.includes("useEffect") &&
        !line.includes("useSyncExternalStore") &&
        !line.includes("function ") &&
        !line.includes("() =>") &&
        !/^\s*\/\//.test(line)
      ) {
        const trimmed = line.trim();
        if (
          !trimmed.startsWith("const ") ||
          trimmed.includes("typeof window") ||
          trimmed.includes("useEffect")
        ) {
          continue;
        }
        if (trimmed.startsWith("const ") && trimmed.includes("localStorage")) {
          filesWithIssue.push(`${relative}:${i + 1}`);
        }
      }
    }
  }

  if (filesWithIssue.length === 0) {
    return {
      name: "localStorage не вызывается на уровне модуля",
      status: "pass",
      details:
        "localStorage в client компонентах используется через useEffect или useSyncExternalStore",
    };
  }

  return {
    name: "localStorage не вызывается на уровне модуля",
    status: "fail",
    details: `Найдены вызовы localStorage на уровне модуля: ${filesWithIssue.join(", ")}`,
  };
}

export function checkNoBrokenHrefs(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];
  const brokenHrefs: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        /href=["'](?:#(?!main-content)|""|undefined|null)["']/.test(line) &&
        !line.includes("skip-link")
      ) {
        brokenHrefs.push(`${relative}:${i + 1}`);
      }
    }
  }

  if (brokenHrefs.length === 0) {
    return {
      name: "Нет битых href",
      status: "pass",
      details: 'href="#", href="" или href="undefined" не найдены',
    };
  }

  return {
    name: "Нет битых href",
    status: "fail",
    details: `Найдены битые href: ${brokenHrefs.join(", ")}`,
  };
}

/* ───── Performance ───── */

export function checkImageOptimization(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /\.tsx$/),
    ...globFiles(componentsDir, /\.tsx$/),
  ];
  const imgTags: string[] = [];
  const nextImageImports: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (/<img\s/.test(content) && !/import\s+Image/.test(content)) {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (/<img\s/.test(lines[i])) {
          imgTags.push(`${relative}:${i + 1}`);
        }
      }
    }
    if (/from\s+["']next\/image["']/.test(content)) {
      nextImageImports.push(relative);
    }
  }

  if (imgTags.length === 0) {
    return {
      name: "next/image для оптимизации изображений",
      status: "pass",
      details: `next/image используется в ${nextImageImports.length} файлах, теги <img> без next/image не найдены`,
    };
  }

  return {
    name: "next/image для оптимизации изображений",
    status: "warn",
    details: `Найдены теги <img> без next/image: ${imgTags.join(", ")}`,
  };
}

export function checkLoadingStates(): SiteCheck {
  const loadingFiles = globFiles(appDir, /loading\.tsx$/);
  const pageDirs = globFiles(appDir, /page\.tsx$/);

  const loadingCount = loadingFiles.length;
  const pageCount = pageDirs.length;

  if (loadingCount >= 2) {
    return {
      name: "Состояния загрузки (loading.tsx)",
      status: "pass",
      details: `Найдено ${loadingCount} loading.tsx на ${pageCount} страниц`,
    };
  }

  return {
    name: "Состояния загрузки (loading.tsx)",
    status: "warn",
    details: `Всего ${loadingCount} loading.tsx на ${pageCount} страниц. Рекомендуется добавить loading.tsx для страниц с асинхронными данными`,
  };
}

export function checkSkeletonUsage(): SiteCheck {
  const skeletonFiles = globFiles(componentsDir, /\.tsx$/);
  const filesWithSkeleton: string[] = [];

  for (const file of skeletonFiles) {
    const content = readFileSafe(file);
    if (/<Skeleton\s/.test(content)) {
      filesWithSkeleton.push(path.relative(process.cwd(), file));
    }
  }

  if (filesWithSkeleton.length > 0) {
    return {
      name: "Skeleton для loading состояний",
      status: "pass",
      details: `Skeleton используется в ${filesWithSkeleton.length} компонентах: ${filesWithSkeleton.join(", ")}`,
    };
  }

  return {
    name: "Skeleton для loading состояний",
    status: "warn",
    details:
      "Skeleton компонент не используется. Рекомендуется добавить skeleton для загрузки контента",
  };
}

/* ───── Visual polish ───── */

export function checkCardHeightConsistency(): SiteCheck {
  const tsxFiles = [
    ...globFiles(componentsDir, /\.tsx$/),
    ...globFiles(appDir, /\.tsx$/),
  ];
  const filesWithHFull: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (/h-full/.test(content) && /bauhaus-card/.test(content)) {
      filesWithHFull.push(relative);
    }
  }

  return {
    name: "Единая высота карточек",
    status: filesWithHFull.length > 0 ? "pass" : "warn",
    details:
      filesWithHFull.length > 0
        ? `${filesWithHFull.length} файлов используют h-full с bauhaus-card для единой высоты`
        : "h-full не используется с bauhaus-card — карточки могут быть разной высоты",
  };
}

export function checkFadeInAnimation(): SiteCheck {
  const tsxFiles = [
    ...globFiles(appDir, /layout\.tsx$/),
    ...globFiles(appDir, /page\.tsx$/),
  ];
  const filesWithFadeIn: string[] = [];

  for (const file of tsxFiles) {
    const content = readFileSafe(file);
    const relative = path.relative(process.cwd(), file);
    if (
      /animate-in.*fade-in/.test(content) ||
      /bauhaus-entrance/.test(content)
    ) {
      filesWithFadeIn.push(relative);
    }
  }

  return {
    name: "Fade-in анимация страниц",
    status: filesWithFadeIn.length > 0 ? "pass" : "warn",
    details:
      filesWithFadeIn.length > 0
        ? `Fade-in анимация найдена в ${filesWithFadeIn.length} layout/page файлах`
        : "Fade-in анимация не обнаружена",
  };
}

/* ───── Vercel readiness ───── */

export function checkMetadataBase(): SiteCheck {
  const layoutContent = readFileSafe(path.join(appDir, "layout.tsx"));

  const hasMetadataBase =
    /metadataBase/i.test(layoutContent) &&
    /NEXT_PUBLIC_SITE_URL/i.test(layoutContent);

  if (hasMetadataBase) {
    return {
      name: "metadataBase через NEXT_PUBLIC_SITE_URL",
      status: "pass",
      details: "layout.tsx содержит metadataBase с NEXT_PUBLIC_SITE_URL",
    };
  }

  return {
    name: "metadataBase через NEXT_PUBLIC_SITE_URL",
    status: "fail",
    details:
      "metadataBase с NEXT_PUBLIC_SITE_URL не найден в layout.tsx — требуется для Vercel",
  };
}

export function checkNodeVersion(): SiteCheck {
  const packageJson = readFileSafe(path.join(process.cwd(), "package.json"));
  const hasEnginesNode = /"node":\s*">*=?\s*(18|20|22)/.test(packageJson);

  if (hasEnginesNode) {
    return {
      name: "engines.node в package.json",
      status: "pass",
      details: "engines.node указан и совместим с Vercel (18/20/22)",
    };
  }

  return {
    name: "engines.node в package.json",
    status: "warn",
    details:
      'engines.node не указан или несовместим с Vercel. Рекомендуется: "node": ">=18.17.0"',
  };
}

export function checkVercelConfig(): SiteCheck {
  const vercelJson = readFileSafe(path.join(process.cwd(), "vercel.json"));

  if (vercelJson) {
    return {
      name: "vercel.json",
      status: "pass",
      details: "vercel.json найден",
    };
  }

  return {
    name: "vercel.json",
    status: "warn",
    details:
      "vercel.json не найден. Vercel может использовать настройки по умолчанию",
  };
}

export function getInternalBugsChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];
  checks.push(checkNoConsoleLogInProduction());
  checks.push(checkNoModuleLevelLocalStorage());
  checks.push(checkNoBrokenHrefs());
  return checks;
}

export function getPerformanceChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];
  checks.push(checkImageOptimization());
  return checks;
}

export function getLoadingChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];
  checks.push(checkLoadingStates());
  checks.push(checkSkeletonUsage());
  return checks;
}

export function getVisualPolishChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];
  checks.push(checkCardHeightConsistency());
  checks.push(checkFadeInAnimation());
  return checks;
}

export function getVercelReadinessChecks(): SiteCheck[] {
  const checks: SiteCheck[] = [];
  checks.push(checkMetadataBase());
  checks.push(checkNodeVersion());
  checks.push(checkVercelConfig());
  return checks;
}

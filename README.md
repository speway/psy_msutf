# psy_msutf

Сайт «Научный сектор психологии» для психологического направления ТФ МГУ.

Проект подготовлен под стандартный деплой на Vercel как Next.js-приложение. Основная языковая версия находится на `/ru`; корень сайта `/` редиректит на `/ru`.

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверка перед деплоем

```bash
npm run check:content
npm run lint
npm run typecheck
npm run build
```

## Vercel

Рекомендуемое имя проекта на Vercel: `psy_msutf`.

Настройки Vercel:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: не указывать вручную
- Install Command: `npm install` или `npm ci`

Переменные окружения:

```env
NEXT_PUBLIC_SITE_URL=https://psy-msutf.vercel.app
TELEGRAM_CHANNEL_NAME=psy_msutf
TELEGRAM_CHANNEL_URL=https://t.me/psy_msutf
CRON_SECRET=
ALLOW_RUNTIME_POST_WRITE=false
```

Preview URL SourceCraft/Vibecraft не должен попадать в metadata, sitemap, robots, canonical и Open Graph.

## Маршруты

Русская версия:

- `/ru`
- `/ru/publications`
- `/ru/glossary`
- `/ru/roadmap`
- `/ru/archive`
- `/ru/contacts`
- `/ru/disciplines`

Английская и узбекская версии работают через `/en/*` и `/uz/*`.

Старые русские маршруты без префикса редиректят на `/ru/*`.

## Публикации из Telegram

Публикации читаются сайтом из `data/posts.json`. Если файл пустой, используется локальный fallback из `lib/mock-data.ts`.

Обновление публикаций:

```bash
npm run sync:telegram
npm run check:content
git add data/posts.json
git commit -m "chore: update Telegram posts"
git push
```

После push Vercel автоматически пересоберёт сайт.

Не рекомендуется писать в `data/posts.json` из Vercel runtime: serverless filesystem не является постоянным хранилищем. Для автоматизации лучше использовать GitHub Action, который запускает `npm run sync:telegram`, коммитит `data/posts.json`, а Vercel деплоит новый commit.

## Важные файлы

- `app/[lang]/*` — основные локализованные страницы
- `components/site-header.tsx` — header, dropdown, mobile menu
- `components/site-footer.tsx` — footer с locale-aware ссылками
- `components/bauhaus-background.tsx` — фон Bauhaus/Ψ
- `data/disciplines.ts` — учебные дисциплины
- `data/glossary.ts` — глоссарий
- `data/posts.json` — публикации Telegram после синхронизации
- `lib/post-source.ts` — единый источник публикаций для страниц и API
- `scripts/sync-telegram-posts.ts` — синхронизация Telegram
- `scripts/check-content.ts` — проверка чистоты публикаций

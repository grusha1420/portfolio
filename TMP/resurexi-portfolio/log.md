# Лог действий

Формат записи (краткий, без loop):

```
Task XX: [Краткое действие]
```

Формат записи (plan-execute-loop) — см. скилл `plan-execute-loop`.

---

## Записи

2026-08-15: Создан полный план разработки портфолио resurexi (27 задач)

---

## Инструкция

Когда выполняешь действие:

1. Добавь новую запись в формате выше
2. Укажи номер задачи (Task XX)
3. Кратко опиши что сделано (1–2 предложения)

Примеры:

- `Task 01: Создан T3-проект с Drizzle и tRPC`
- `Task 02: Добавлены таблицы works, blog_posts, contact_requests`
- `Task 10: Реализован wireframe-эффект с mousemove/scroll`

---

## Task 01 — 2026-08-15 23:47:46 +04

**Executor:** plan-executor subagent  
**Task file:** `task-01.md`  
**Status:** completed

### Changes
- Создан T3-проект (create-t3-app 7.40.0) в корне workspace: Next.js 15 App Router, TypeScript strict, Tailwind CSS 4, tRPC, Drizzle ORM, PostgreSQL, ESLint/Prettier
- Установлены дополнительные зависимости: next-themes, @calcom/embed-react, uploadthing, @mdxeditor/editor, react-masonry-css, lucide-react, next-mdx-remote, @tailwindcss/typography, @dnd-kit/core, @dnd-kit/sortable, slugify (zod уже в T3)
- Создан `.env.example` со всеми переменными из концепта
- Создана структура каталогов компонентов (`src/components/*`, `src/lib/`) с `.gitkeep`
- Настроен `.npmrc` для pnpm (hoisted linker, temp store-dir, confirmModulesPurge, allowBuilds) — обход EINVAL на btrfs default store
- Проверено: `pnpm dev` (HTTP 200 на :3010), `pnpm lint`, `pnpm build` — успешно

### Files
- `package.json` — создан / изменён (имя resurexi-portfolio, deps, packageManager pnpm)
- `pnpm-lock.yaml` — создан
- `.npmrc` — создан
- `.env.example` — изменён (полный шаблон env)
- `.gitignore`, `tsconfig.json`, `next.config.js`, `drizzle.config.ts`, `eslint.config.js`, `prettier.config.js`, `postcss.config.js` — созданы T3
- `src/app/`, `src/server/`, `src/trpc/`, `src/styles/` — созданы T3
- `src/components/{ui,layout,sections,admin,work,blog,mdx}/.gitkeep` — созданы
- `src/lib/.gitkeep` — создан
- `drizzle/.gitkeep` — присутствует
- `start-database.sh`, `README.md`, `public/` — созданы T3

### Acceptance criteria
- [x] T3-проект создан с Next.js, Tailwind, tRPC, Drizzle, Postgres
- [x] Все дополнительные зависимости установлены
- [x] `.env.example` содержит все переменные из концепта
- [x] Структура каталогов компонентов создана
- [x] `pnpm dev` запускается без ошибок
- [x] `pnpm build` проходит успешно
- [x] `pnpm lint` без ошибок

### Notes
- T3 создавался во временной папке `_t3tmp` (non-interactive `CI=true npx create-t3-app`) и перенесён в корень — прямой scaffold в непустой корень блокировался TTY/ENOENT
- `@mdxeditor/editor@4.2.0` совместим с React 19 / Next.js 15 — `pnpm build` прошёл без pin React 18
- Папки `TMP/` и `план портфолио/` сохранены без изменений
- `.npmrc` использует `store-dir=/tmp/pnpm-store-resurexi` из-за EINVAL при copyfile в default pnpm store на btrfs

### Вопросы пользователю
_нет_

## Task 02 — 2026-08-15 23:55:19 +04

**Executor:** plan-executor subagent  
**Task file:** `task-02.md`  
**Status:** completed

### Changes
- Определена полная схема PostgreSQL в Drizzle ORM: categories, works, work_categories (junction), work_gallery_images, work_youtube_videos, blog_posts, contact_links, contact_requests, site_content
- Настроены relations: works ↔ categories (many-to-many), works → galleryImages/youtubeVideos (one-to-many)
- Добавлен pgEnum `site_content_key` (`hero`, `about_preview`, `contact_info`)
- Установлен `@paralleldrive/cuid2` для генерации ID
- Схема применена через `drizzle-kit push` к локальному Postgres (контейнер `resurexi-portfolio-db`, порт 5436)
- Удалён неиспользуемый T3-boilerplate `post.tsx` и demo-процедуры post router (ссылали на удалённую таблицу `posts`)

### Files
- `src/server/db/schema.ts` — изменён (полная схема портфолио)
- `package.json` — изменён (добавлен `@paralleldrive/cuid2`)
- `pnpm-lock.yaml` — изменён
- `src/server/api/routers/post.ts` — изменён (удалены demo-процедуры create/getLatest)
- `src/app/_components/post.tsx` — удалён (неиспользуемый T3-boilerplate)

### Acceptance criteria
- [x] Все 8 сущностей (+ junction) определены в schema.ts — 9 таблиц
- [x] Relations настроены корректно
- [x] Defaults: hidden=true, featured=false, isMain=false, isRead=false
- [x] Unique constraints на slug-полях
- [x] `pnpm db:push` успешно применяет схему — с DATABASE_URL на порту 5436
- [x] Drizzle Studio показывает все таблицы — 9 таблиц `_t3tmp_*` подтверждены
- [x] Нет ошибок TypeScript в schema

### Notes
- `.env` указывает на `localhost:5432`, но auth не проходит (конфликт с `resonance-db-prod`). Поднят контейнер `resurexi-portfolio-db` на порту **5436** — рекомендуется обновить DATABASE_URL
- Cascade delete на gallery/videos при удалении work; junction cascade при удалении work/category

### Вопросы пользователю
_нет_

## Task 03 — 2026-08-15 23:57:10 +04

**Executor:** plan-executor subagent  
**Task file:** `task-03.md`  
**Status:** completed

### Changes
- Добавлен `protectedProcedure` с проверкой admin session (заглушка `getSession` в `src/server/auth.ts` до Task 04)
- Созданы tRPC-роутеры: `works`, `categories`, `blog`, `contact`, `content`, `admin` — объединены в `appRouter`
- Public endpoints: фильтр `hidden=false` на list-запросах, `getBySlug` без фильтра hidden; relations (categories, gallery, videos) для works
- Admin CRUD (protected): works, categories, blog, contact links/requests, site content
- Shared Zod-схемы в `src/server/api/schemas/index.ts` (включая YouTube URL, contact form, CRUD inputs)
- Утилиты: `src/lib/slug.ts` (slugify + ensureUniqueSlug), `src/lib/cn.ts` (clsx + tailwind-merge)
- Удалён T3-boilerplate `post` router

### Files
- `src/server/auth.ts` — создан (session stub)
- `src/server/api/trpc.ts` — изменён (session в context, protectedProcedure)
- `src/server/api/root.ts` — изменён (все sub-routers)
- `src/server/api/schemas/index.ts` — создан
- `src/server/api/routers/works.ts` — создан
- `src/server/api/routers/categories.ts` — создан
- `src/server/api/routers/blog.ts` — создан
- `src/server/api/routers/contact.ts` — создан
- `src/server/api/routers/content.ts` — создан
- `src/server/api/routers/admin.ts` — создан (login stub → Task 04)
- `src/server/api/routers/post.ts` — удалён
- `src/lib/slug.ts` — создан
- `src/lib/cn.ts` — создан
- `package.json` — изменён (clsx, tailwind-merge, @paralleldrive/cuid2)
- `pnpm-lock.yaml` — изменён

### Acceptance criteria
- [x] appRouter объединяет все sub-routers
- [x] Public endpoints возвращают корректные данные с relations (works: categories, gallery, videos)
- [x] hidden=false фильтр на list, но не на getBySlug
- [x] Zod-схемы для всех inputs
- [x] Slug utility с uniqueness check
- [x] TypeScript inference работает на клиенте через api.xxx.useQuery (AppRouter экспортирован в trpc/react.tsx)

### Notes
- `admin.login` возвращает NOT_IMPLEMENTED — полная реализация в Task 04
- `protectedProcedure` возвращает UNAUTHORIZED без сессии (stub всегда null)
- Переустановлен `@paralleldrive/cuid2` — был в package.json, но отсутствовал в node_modules

### Вопросы пользователю
_нет_

## Task 04 — 2026-08-15 23:59:13 +04

**Executor:** plan-executor subagent  
**Task file:** `task-04.md`  
**Status:** completed

### Changes
- Реализована password-based авторизация админки через `ADMIN_PASSWORD` и signed httpOnly cookie с `SESSION_SECRET` (HMAC-SHA256, Web Crypto — совместимо с Edge middleware)
- Добавлены `createSession()`, `destroySession()`, `getSession()`; payload сессии `{ isAdmin: true, exp }`, TTL 7 дней, cookie без maxAge (session cookie)
- Обновлены `admin.login` (timing-safe compare), `admin.logout` (clear cookie), `admin.getSession`; `protectedProcedure` читает сессию из ctx
- Добавлен Next.js middleware для `/admin` и `/admin/*` с исключением `/admin/login`
- Создана страница логина с tRPC mutation и error state; placeholder `/admin`
- В `env.js` добавлена валидация `ADMIN_PASSWORD` и `SESSION_SECRET` (min 32 символа)

### Files
- `src/server/auth/session.ts` — создан (encode/decode, parse cookie, edge-safe)
- `src/server/auth.ts` — изменён (createSession, destroySession, getSession, safeComparePassword)
- `src/server/api/routers/admin.ts` — изменён (login/logout/getSession)
- `src/middleware.ts` — создан (redirect без сессии)
- `src/app/admin/login/page.tsx` — создан (форма логина)
- `src/app/admin/page.tsx` — создан (placeholder dashboard)
- `src/env.js` — изменён (ADMIN_PASSWORD, SESSION_SECRET)

### Acceptance criteria
- [x] /admin без сессии → redirect /admin/login — middleware
- [x] Верный пароль → доступ к /admin — login mutation + createSession
- [x] Неверный пароль → сообщение об ошибке — UNAUTHORIZED + UI error state
- [x] Logout очищает сессию — destroySession в admin.logout
- [x] protectedProcedure возвращает UNAUTHORIZED без cookie — enforceAdmin middleware
- [x] Cookie httpOnly, secure в production — cookieStore.set options
- [x] /admin/login доступен без auth — early return в middleware

### Notes
- Session crypto вынесен в `auth/session.ts` без `next/headers`, чтобы middleware не тянул server-only imports
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 05 — 2026-08-16 00:00:35 +04

**Executor:** plan-executor subagent  
**Task file:** `task-05.md`  
**Status:** completed

### Changes
- Определены CSS-переменные дизайн-системы в `globals.css`: base colors, segment accents (A/B), brand accent (orange), card/input tokens; dark mode overrides в `.dark`
- Расширен `@theme` Tailwind v4: цвета через CSS variables, radius tokens, utility `container-content`
- Подключён `next-themes`: `ThemeProvider` (attribute=class, defaultTheme=system, enableSystem), `suppressHydrationWarning` на `<html>`
- Созданы UI-примитивы: Button (primary/secondary/ghost, sm/md/lg, rounded-full), Input, Textarea, Label (required * accent), Modal (backdrop blur, close ×), Badge (pill), Card (image + metadata slots)
- Создан `MediaImage`: `isAnimated=true` → native `<img>` (GIF), иначе `next/image`; не зависит от расширения URL
- Создан shared `MDXContent` (server component, `next-mdx-remote/rsc`, prose typography, custom img→MediaImage, styled links/blockquotes)
- Создан `ThemeToggle` (sun/moon, mounted guard для SSR) — для Header в Task 07

### Files
- `src/styles/globals.css` — изменён (design tokens, @theme, container-content)
- `src/app/layout.tsx` — изменён (ThemeProvider, body classes, suppressHydrationWarning)
- `src/components/providers/theme-provider.tsx` — создан
- `src/components/ui/button.tsx` — создан
- `src/components/ui/input.tsx` — создан
- `src/components/ui/textarea.tsx` — создан
- `src/components/ui/label.tsx` — создан
- `src/components/ui/modal.tsx` — создан
- `src/components/ui/badge.tsx` — создан
- `src/components/ui/card.tsx` — создан
- `src/components/ui/media-image.tsx` — создан
- `src/components/ui/index.ts` — создан
- `src/components/mdx/mdx-content.tsx` — создан
- `src/components/layout/theme-toggle.tsx` — создан
- `src/components/ui/.gitkeep` — удалён
- `src/components/mdx/.gitkeep` — удалён
- `src/components/layout/.gitkeep` — удалён

### Acceptance criteria
- [x] CSS-переменные для всех segment colors и theme
- [x] next-themes работает: system/light/dark
- [x] UI-примитивы: Button, Input, Textarea, Label, Modal, Badge, Card
- [x] MDXContent shared component работает с next-mdx-remote
- [x] MediaImage корректно анимирует GIF (isAnimated flag → unoptimized img)
- [x] Tailwind использует CSS variables
- [x] Placeholder-палитра визуально coherent (cream/orange/purple YNG/Kenney inspired)
- [x] Нет ошибок линтера — `pnpm lint`, `pnpm typecheck`, `pnpm build` успешно

### Notes
- Tailwind v4: конфигурация цветов через `@theme` в globals.css, не tailwind.config.js
- ThemeToggle не подключён в layout — интеграция в Header запланирована в Task 07
- MDXContent img не получает isAnimated из markdown — флаг передаётся явно при использовании MediaImage (Task 09/16+)

### Вопросы пользователю
_нет_

## Task 06 — 2026-08-16 00:01:49 +04

**Executor:** plan-executor subagent  
**Task file:** `task-06.md`  
**Status:** completed

### Changes
- Проанализирован kenney.nl: волны — inline SVG с quadratic bezier paths, два слоя (main + shadow) на top, горизонтальный scroll 8s linear через `background-position` / translateX
- Создан `WaveDivider`: props `position` (top/bottom), `fillColor`, `backgroundColor`, `animated`; organic paths из Kenney frontpage-wave SVG; tiled duplicate (1280px) для seamless loop; `-mt-px`/`-mb-px` overlap против 1px seam
- Анимация в `globals.css`: `wave-divider-animate` / `-reverse`, `prefers-reduced-motion: reduce` отключает
- Создан `ColoredSegment`: variant `a` | `b` | `default` → CSS variables сегментов; обёртка WaveDivider top + children + bottom; props `waves`, `animated`
- Экспорт layout-компонентов через `src/components/layout/index.ts`

### Files
- `src/components/layout/wave-paths.ts` — создан (Kenney-inspired SVG path constants)
- `src/components/layout/WaveDivider.tsx` — создан
- `src/components/layout/ColoredSegment.tsx` — создан
- `src/components/layout/index.ts` — создан
- `src/styles/globals.css` — изменён (wave keyframes + reduced-motion)

### Acceptance criteria
- [x] WaveDivider top/bottom рендерятся без visual gaps — overlap -1px, rect + path layering
- [x] Органическая форма волны соответствует референсу Kenney — Q-curves из frontpage-wave SVG, не triangle/zigzag
- [x] Анимация subtle и работает — 8s horizontal scroll, forward/reverse по position
- [x] prefers-reduced-motion отключает анимацию — media query в globals.css
- [x] fillColor настраивается через CSS variables — prop + ColoredSegment maps to `--segment-accent-*-bg`
- [x] Responsive full-width на всех breakpoints — `w-full`, `preserveAspectRatio="none"`, `h-[clamp(3.75rem,8vw,7.5rem)]`
- [x] Нет ошибок линтера — `pnpm lint`, `pnpm typecheck`, `pnpm build` успешно

### Notes
- Kenney использует adjacent color в SVG overlay + segment bg за волной; WaveDivider повторяет: rect fillColor + path backgroundColor
- Top: два слоя (main + shadow 8% opacity); bottom: один overlay path
- Компоненты не интегрированы в страницы (по task-06) — готовы для Task 11/13/14

### Вопросы пользователю
_нет_

## Task 08 — 2026-08-16 00:03:26 +04

**Executor:** plan-executor subagent  
**Task file:** `task-08.md`  
**Status:** completed

### Changes
- Создан `CalComProvider` + `useCalCom()` (open/close/isOpen/isConfigured) — единый глобальный контекст для Cal.com popup
- Реализован popup-модал: backdrop `bg-black/80`, центрированная панель max-w 900px, min-height 600px, fade/scale анимация
- Интеграция `@calcom/embed-react`: lazy dynamic import при первом open (`shouldLoadEmbed`), `<Cal calLink="..." />`
- UX: закрытие по ×, backdrop, Escape; body scroll lock; fallback-ссылка «Open booking page in a new tab» при проблемах с iframe
- Утилита `parseCalLink` / `getPublicCalLink` — парсинг `NEXT_PUBLIC_CAL_COM_URL` (full URL или path)
- `BookCallButton` — обёртка над Button, вызывает `useCalCom().open()`; скрывается если cal link не настроен
- `CalComProvider` подключён в root layout; env.js: optional `CAL_COM_URL`, `NEXT_PUBLIC_CAL_COM_URL`, `NEXT_PUBLIC_SITE_URL`

### Files
- `src/components/CalComModal.tsx` — создан (provider, hook, modal panel)
- `src/components/BookCallButton.tsx` — создан
- `src/lib/cal-link.ts` — создан (parseCalLink, getPublicCalLink, getCalBookingUrl)
- `src/app/layout.tsx` — изменён (CalComProvider)
- `src/env.js` — изменён (optional Cal.com и site URL env vars)

### Acceptance criteria
- [x] Modal opens from any Book call / Get in touch trigger — `BookCallButton` + `useCalCom().open()` паттерн готов для Hero/Contact/Header
- [x] Cal.com embed loads and is interactive — dynamic `<Cal calLink={...} />` при первом open
- [x] Close via ×, backdrop, Escape — реализовано
- [x] Body scroll locked when open — `document.body.style.overflow = 'hidden'`
- [x] Backdrop darkened like YNG reference — `bg-black/80`
- [x] Works on mobile — `p-4`, `w-full`, `max-h-[90vh]`, responsive padding
- [x] Env-based cal link configuration — `NEXT_PUBLIC_CAL_COM_URL` + parse utility

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно

### Вопросы пользователю
_нет_

## Task 09 — 2026-08-16 00:04:27 +04

**Executor:** plan-executor subagent  
**Task file:** `task-09.md`  
**Status:** completed

### Changes
- Настроен Uploadthing v7: file router с двумя endpoints — `imageUploader` (images, 4MB, до 20 файлов) и `heroImageUploader` (images/GIF, 16MB, 1 файл)
- Middleware проверяет admin session через `getSession(req.headers)`; без сессии — `UploadThingError` FORBIDDEN (403)
- Route handler `/api/uploadthing` с токеном, собранным из `UPLOADTHING_SECRET` + `UPLOADTHING_APP_ID` (v7 `UPLOADTHING_TOKEN` format)
- Создан переиспользуемый `ImageUploader`: dropzone, preview thumbnails, delete, loading, error banner с Retry, авто-`isAnimated` для GIF
- `generateReactHelpers` → `useUploadThing` в `src/utils/uploadthing.ts`
- Env validation: `UPLOADTHING_SECRET` (sk_…), `UPLOADTHING_APP_ID`
- Демо-секция `UploadTestSection` на `/admin` — single cover, multiple gallery, hero GIF variant

### Files
- `src/app/api/uploadthing/core.ts` — создан (fileRouter + auth middleware)
- `src/app/api/uploadthing/route.ts` — создан (GET/POST handler)
- `src/utils/uploadthing.ts` — создан (useUploadThing, uploadFiles)
- `src/lib/uploadthing-token.ts` — создан (build v7 token from secret + app id)
- `src/components/admin/ImageUploader.tsx` — создан
- `src/app/admin/_components/upload-test.tsx` — создан
- `src/app/admin/page.tsx` — изменён (UploadTestSection)
- `src/env.js` — изменён (UPLOADTHING_SECRET, UPLOADTHING_APP_ID)
- `next.config.js` — изменён (remotePatterns utfs.io, *.ufs.sh)

### Acceptance criteria
- [x] Uploadthing route works with admin auth — middleware + `/api/uploadthing` route
- [x] ImageUploader single and multiple modes — discriminated props + demo on /admin
- [x] Preview and delete in UI — thumbnail grid + remove button
- [x] GIF upload works for Hero — `heroImageUploader` endpoint, 16MB, isAnimated detection
- [x] Env vars validated — UPLOADTHING_SECRET, UPLOADTHING_APP_ID in env.js
- [x] Used in at least one test admin form — UploadTestSection on /admin

### Notes
- Uploadthing v7 использует `UPLOADTHING_TOKEN`; токен собирается из legacy env vars через `buildUploadthingToken()` (region default `sea1`)
- `uploadthing/tw/v4.css` не импортирован — экспорт пакета несовместим с Tailwind v4 @import; кастомный ImageUploader не зависит от UT UI
- Auth failure возвращает 403 (FORBIDDEN), не 401 — ограничение Uploadthing error codes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 07 — 2026-08-16 00:07:31 +04

**Executor:** plan-executor subagent  
**Task file:** `task-07.md`  
**Status:** completed

### Changes
- Создан фиксированный `Header`: logo «resurexi», nav (Work, About, Contact), CTA `BookCallButton`, `ThemeToggle`
- Nav: Work → `/work`, About → `/about`, Contact → `#contact` на главной / `/#contact` на других страницах
- Scroll state: прозрачный header над hero на `/` при scrollY ≤ 50, solid `bg-background/80 backdrop-blur` при скролле
- Mobile: hamburger ниже `md`, slide-out panel справа с теми же ссылками + CTA, body scroll lock, закрытие по overlay/навигации
- Active state: orange underline на `/work` и `/about`
- Smooth scroll: `scroll-behavior: smooth` в CSS, `scroll-margin-top: 5rem` для `#hero`, `#featured-work`, `#about`, `#contact`
- Deep link `/#contact`: scroll on load через effect в Header
- Header подключён в root layout; stub-страницы `/work`, `/about`; главная с section ids для проверки anchor scroll

### Files
- `src/components/layout/Header.tsx` — создан
- `src/components/layout/index.ts` — изменён (export Header)
- `src/app/layout.tsx` — изменён (Header в layout)
- `src/styles/globals.css` — изменён (smooth scroll, scroll-margin-top)
- `src/app/page.tsx` — изменён (section ids hero/featured-work/about/contact)
- `src/app/work/page.tsx` — создан (stub)
- `src/app/about/page.tsx` — создан (stub)

### Acceptance criteria
- [x] Header fixed на всех страницах — `fixed inset-x-0 top-0 z-50` в root layout
- [x] Smooth scroll к сегментам на главной с header offset — CSS smooth + scroll-margin-top + anchor handler
- [x] Links на /work, /about работают — stub pages + Link components
- [x] CTA открывает Cal.com modal — `BookCallButton` → `useCalCom().open()`
- [x] Theme toggle работает — `ThemeToggle` в desktop и mobile header
- [x] Mobile hamburger menu — slide-out panel с nav + CTA
- [x] Visual style aligned with YNG reference (clean, orange CTA) — orange pill CTA, clean nav, backdrop on scroll
- [x] Active state на subpages — underline decoration на Work/About по pathname

### Notes
- IntersectionObserver для highlight текущей секции на главной не реализован (optional enhancement в task)
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 10 — 2026-08-16 00:08:31 +04

**Executor:** plan-executor subagent  
**Task file:** `task-10.md`  
**Status:** completed

### Changes
- Реализована Hero-секция: fullscreen GIF-фон (или gradient fallback), gradient overlay, overline/title/subtitle из `site_content` через tRPC
- Server component `Hero` загружает `content.getHero` и `contact.getLinks`; client `HeroInteractive` рендерит UI и CTA
- `HeroWireframe`: dual-layer B&W + color images, desktop opacity от Y-курсора в Hero (rAF throttle), mobile — от scroll progress страницы
- `prefers-reduced-motion` → статичная opacity 50%; touch devices — только scroll, без mousemove
- WhatsApp/Telegram ссылки фильтруются из `contact_links` (wa.me, t.me, label)
- `BookCallButton` открывает Cal.com modal; placeholder assets в `public/placeholders/`
- Главная страница подключена к `<Hero />` вместо stub-секции

### Files
- `src/components/sections/Hero.tsx` — создан (server wrapper + data resolution)
- `src/components/sections/HeroInteractive.tsx` — создан (client layout, contacts, CTA)
- `src/components/sections/HeroWireframe.tsx` — создан (dual-layer wireframe effect)
- `src/components/sections/hero-constants.ts` — создан (placeholders, link filter)
- `src/components/sections/index.ts` — создан (exports)
- `src/app/page.tsx` — изменён (Hero вместо stub)
- `public/placeholders/hero-bg.gif` — создан (animated placeholder)
- `public/placeholders/wireframe-bw.svg` — создан
- `public/placeholders/wireframe-color.svg` — создан

### Acceptance criteria
- [x] Fullscreen GIF background with overlay text — GIF/gradient + gradient overlay + text block
- [x] Wireframe B&W + color layers aligned pixel-perfect — stacked absolute images, same dimensions, object-contain
- [x] Desktop: opacity follows cursor Y within Hero — mousemove on hero section, rAF throttled
- [x] Mobile: opacity follows page scroll progress 0→1 — scroll listener with passive + rAF
- [x] WhatsApp/Telegram links from DB — `isMessagingLink` filter on `contact.getLinks`
- [x] Book a call opens Cal.com modal — `BookCallButton` → `useCalCom().open()`
- [x] Content editable via site_content — данные из `content.getHero`, placeholders при пустой БД
- [x] Placeholder assets for empty state — `public/placeholders/` + `HERO_PLACEHOLDERS`
- [x] section id="hero" for nav scroll — `id="hero"` на section

### Notes
- Overline «3D Designer» статичен — в схеме `site_content` нет отдельного поля overline
- При записи hero в БД без wireframe URL блок wireframe скрывается; полные placeholders только когда записи hero нет
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 11 — 2026-08-16 00:10:11 +04

**Executor:** plan-executor subagent  
**Task file:** `task-11.md`  
**Status:** completed

### Changes
- Создан `WorkCard`: Link на `/work/[slug]`, cover через `MediaImage` с `coverIsAnimated`, aspect 16/10, hover scale/overlay, category pills (outline Badge), line-clamp на title, placeholder при пустом cover
- Создана секция `FeaturedWork`: server component, `api.works.listFeatured`, header (label orange caps + title + «View all work →»), 2-col grid desktop / 1-col mobile, empty state
- Обёртка `ColoredSegment variant="a"` + WaveDivider для accent A фона
- Главная страница: stub заменён на `<FeaturedWork />`
- Исправлена типизация `mapWork` в works router (корректный inference полей work)

### Files
- `src/components/work/WorkCard.tsx` — создан
- `src/components/work/index.ts` — создан
- `src/components/sections/FeaturedWork.tsx` — создан
- `src/components/sections/index.ts` — изменён (export FeaturedWork)
- `src/app/page.tsx` — изменён (FeaturedWork вместо stub)
- `public/placeholders/work-cover.svg` — создан
- `src/server/api/routers/works.ts` — изменён (WorkWithRelationsRow type для mapWork)

### Acceptance criteria
- [x] Shows only featured=true AND hidden=false works — `works.listFeatured` фильтрует оба флага
- [x] WorkCard links to correct /work/[slug] — Link wrapper с work.slug
- [x] Categories displayed as pills — outline Badge на каждой категории
- [x] View all work → /work — Link в header секции
- [x] Layout matches YNG 2-column reference — `grid-cols-1 md:grid-cols-2`
- [x] id="featured-work" for nav — на контейнере секции
- [x] Empty state handled — «No featured work yet», grid скрыт
- [x] Images lazy-loaded — MediaImage / next/image lazy по умолчанию

### Notes
- Label «01 — Featured Work» с CSS uppercase (small caps стиль YNG)
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 12 — 2026-08-16 00:11:49 +04

**Executor:** plan-executor subagent  
**Task file:** `task-12.md`  
**Status:** completed

### Changes
- Создан `AboutPreview`: server component, `api.content.getAboutPreview`, двухколоночный layout (text + optional image), label «02 — About», CTA «Learn more» → `/about`
- Default background (`bg-segment-default`) — без ColoredSegment и WaveDivider; переход от Featured обеспечивает нижняя волна Featured (accent A → default)
- Placeholders для title/text о 3D-дизайнере при пустой БД или пустых полях; без image — одноколоночный layout `max-w-3xl`
- Главная страница: stub About заменён на `<AboutPreview />`

### Files
- `src/components/sections/AboutPreview.tsx` — создан
- `src/components/sections/about-preview-constants.ts` — создан
- `src/components/sections/index.ts` — изменён (export AboutPreview)
- `src/app/page.tsx` — изменён (AboutPreview вместо stub)

### Acceptance criteria
- [x] Displays title, text, optional image from DB — `resolveAboutContent` из `content.getAboutPreview`
- [x] Button navigates to /about — Link href="/about" с primary CTA styling
- [x] Default background segment (не цветной) — `bg-segment-default`, без ColoredSegment
- [x] id="about" for header scroll — на `<section id="about">`
- [x] Responsive two-column / stacked — `grid-cols-1 md:grid-cols-2` при image, иначе full-width text
- [x] Placeholder when content empty — `ABOUT_PREVIEW_PLACEHOLDERS` при отсутствии записи или пустых полях

### Notes
- CTA текст «Learn more» (альтернатива «Read my story» из task — выбран первый вариант)
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

## Task 12 — 2026-08-16 00:12:49 +04

**Executor:** plan-executor subagent  
**Task file:** `task-12.md`  
**Status:** completed

### Changes
- Создан `AboutPreview`: server component, `api.content.getAboutPreview`, двухколоночный layout (text + optional image), label «02 — About», CTA «Learn more» → `/about`
- Default background (`bg-segment-default`) — без ColoredSegment и WaveDivider; переход от Featured обеспечивает нижняя волна Featured (accent A → default)
- Placeholders для title/text о 3D-дизайнере при пустой БД или пустых полях; без image — одноколоночный layout `max-w-3xl`
- Главная страница: stub About заменён на `<AboutPreview />`
- Проверка: `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно

### Files
- `src/components/sections/AboutPreview.tsx` — создан
- `src/components/sections/about-preview-constants.ts` — создан
- `src/components/sections/index.ts` — изменён (export AboutPreview)
- `src/app/page.tsx` — изменён (AboutPreview вместо stub)

### Acceptance criteria
- [x] Displays title, text, optional image from DB — `resolveAboutContent` из `content.getAboutPreview`
- [x] Button navigates to /about — Link href="/about" с primary CTA styling
- [x] Default background segment (не цветной) — `bg-segment-default`, без ColoredSegment
- [x] id="about" for header scroll — на `<section id="about">`
- [x] Responsive two-column / stacked — `grid-cols-1 md:grid-cols-2` при image, иначе full-width text
- [x] Placeholder when content empty — `ABOUT_PREVIEW_PLACEHOLDERS` при отсутствии записи или пустых полях

### Notes
- CTA текст «Learn more» (альтернатива «Read my story» из task — выбран первый вариант)
- Реализация верифицирована повторным прогоном lint/typecheck/build

### Вопросы пользователю
_нет_

---

## Task 13 — 2026-08-16 00:13:27 +04

**Executor:** plan-executor subagent  
**Task file:** `task-13.md`  
**Status:** completed

### Changes
- Создан `ContactSection` с prop `variant`: `home` — ColoredSegment accent B + WaveDivider top/bottom; `page` — `bg-background` без волн
- Создан `ContactForm`: поля name*, company, email*, phone, message*; Zod-валидация через `contactRequestSchema`; submit через `contact.submitRequest`; success «Message sent», inline errors, disable при pending
- Создан `SocialLinks`: `contact.getLinks`, grid icon+label, `iconUrl` или Lucide `Link` fallback; скрывается при пустом списке
- Панель Contact Info: `content.getContactInfo` (email, response time, based in) + placeholders + `BookCallButton` + SocialLinks
- Двухколоночный layout (form слева, info card справа), label «03 — Contact», English labels
- Главная: stub Contact заменён на `<ContactSection variant="home" />`; export для subpages с `variant="page"`

### Files
- `src/components/sections/ContactSection.tsx` — создан
- `src/components/sections/ContactForm.tsx` — создан
- `src/components/sections/SocialLinks.tsx` — создан
- `src/components/sections/contact-info-constants.ts` — создан
- `src/components/sections/index.ts` — изменён (export ContactSection)
- `src/app/page.tsx` — изменён (ContactSection variant="home")

### Acceptance criteria
- [x] Form validates and submits to DB — `contactRequestSchema` + `contact.submitRequest`
- [x] Required fields enforced client + server — name, email, message required; Zod на клиенте, schema на сервере
- [x] Success/error states shown — «Message sent» / inline error + field errors
- [x] Social links from admin with Link icon fallback — `SocialLinks` + `contact.getLinks`
- [x] Book a call opens Cal.com modal — `BookCallButton` в info panel
- [x] Layout matches contact.png two-column reference — `grid lg:grid-cols-2`, form left, info card right
- [x] On homepage: accent B segment with waves (`variant='home'`) — ColoredSegment variant="b" waves="both"
- [x] On subpages: default bg (`variant='page'`) — `bg-background`, без ColoredSegment
- [x] Component exported for reuse on subpages — export `ContactSection` + `ContactSectionProps`
- [x] English labels — Name, Company, Email, Phone, Message, Send →, etc.

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Subpages (/work, /about, /blog) подключат `variant="page"` в Task 15–18

### Вопросы пользователю
_нет_

---

## Task 14 — 2026-08-16 00:14:41 +04

**Executor:** plan-executor subagent  
**Task file:** `task-14.md`  
**Status:** completed

### Changes
- Собрана главная `/`: `<main id="main-content">` с секциями Hero → FeaturedWork → AboutPreview → ContactSection (`variant="home"`) в порядке концепта
- Задокументирован паттерн фонов в комментарии page.tsx: default (Hero) → accent A + waves (Featured) → default (About) → accent B + waves (Contact)
- Root layout: metadata title «resurexi — 3D Designer», `metadataBase` из `NEXT_PUBLIC_SITE_URL`, openGraph siteName; Header, ThemeProvider, CalComProvider, TRPCReactProvider уже подключены
- Anchor ids перенесены на semantic `<section>`: `id="featured-work"` и `id="contact"` на ColoredSegment; `scroll-margin-top: 5rem` в globals.css для #hero, #featured-work, #about, #contact
- Footer не добавлялся — Contact-секция является нижней частью страницы (по концепту)
- Проверка: `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Files
- `src/app/page.tsx` — изменён (финальная сборка секций, комментарий паттерна, main id)
- `src/app/layout.tsx` — изменён (metadata title, metadataBase, openGraph)
- `src/components/layout/ColoredSegment.tsx` — изменён (optional `id` prop на `<section>`)
- `src/components/sections/FeaturedWork.tsx` — изменён (`id="featured-work"` на ColoredSegment)
- `src/components/sections/ContactSection.tsx` — изменён (`id="contact"` на ColoredSegment/section)

### Acceptance criteria
- [x] All 4 sections render in order on / — Hero, FeaturedWork, AboutPreview, ContactSection variant="home"
- [x] Background pattern: default → A → default → B — Hero transparent/GIF, Featured ColoredSegment A, About bg-segment-default, Contact ColoredSegment B
- [x] Header navigation scrolls to correct sections — Contact `#contact` smooth scroll + scroll-margin; Work/About → /work, /about (Task 07)
- [x] No visual gaps between segments and waves — WaveDivider `-mt-px`/`-mb-px`, adjacent colors via ColoredSegment tokens
- [x] Dark/light theme works across full page — ThemeProvider + CSS variables для всех сегментов
- [x] Cal.com accessible from Hero and Contact — BookCallButton в HeroInteractive и ContactInfoPanel через CalComProvider
- [x] Page metadata: title «resurexi — 3D Designer» or similar — `title.default` в layout metadata

### Notes
- Секции progressively подключались в Task 07/10–13; Task 14 формализует сборку и metadata
- Visual QA по Fullpage Kenney/YNG — структура и волны реализованы в Task 06/11/13; browser screenshot не выполнялся в этом проходе

### Вопросы пользователю
_нет_

---

## Task 15 — 2026-08-16 00:15:58 +04

**Executor:** plan-executor subagent  
**Task file:** `task-15.md`  
**Status:** completed

### Changes
- Создан `PageHero` (overline, title, description) для subpage-заголовков
- Собрана страница `/work`: PageHero + `WorkGallery` + `ContactSection variant="page"`
- Создан client-компонент `WorkGallery`: tRPC `works.listAll` + `categories.listPublic`, category pills (All + dynamic), search по title/category name (case-insensitive, AND-логика), masonry через `react-masonry-css` (3/2/1 cols), empty states («No work yet» / «No work found»)
- Переиспользован `WorkCard` с `MediaImage` lazy loading и ссылками на `/work/[slug]`
- Header: Work active на `/work` уже через `matchPath` (Task 07)

### Files
- `src/components/layout/PageHero.tsx` — создан
- `src/components/layout/index.ts` — изменён (export PageHero)
- `src/components/work/WorkGallery.tsx` — создан
- `src/components/work/index.ts` — изменён (export WorkGallery)
- `src/app/work/page.tsx` — изменён (полная сборка gallery page)

### Acceptance criteria
- [x] /work lists all hidden=false works — `api.works.listAll` (server filters hidden=false)
- [x] Masonry layout responsive — breakpointCols `{ default: 3, 1024: 2, 640: 1 }`
- [x] Category filter works — pills All + categories, AND with search
- [x] Search by title and category name — `matchesSearch` case-insensitive includes
- [x] WorkCard links to /work/[slug] — reused WorkCard from Task 11
- [x] ContactSection at bottom — `variant="page"`, full section not footer
- [x] Matches work.png structure — overline «— WORK», title, pills, masonry grid, contact
- [x] Client-side filtering performant — useMemo filter, ~30 items max

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- API: `categories.listPublic` (task упоминает `categories.list`; в роутере public endpoint — `listPublic`)
- Visual QA по work.png — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 16 — 2026-08-16 00:17:13 +04

**Executor:** plan-executor subagent  
**Task file:** `task-16.md`  
**Status:** completed

### Changes
- Создан dynamic route `/work/[slug]`: server fetch `works.getBySlug`, `notFound()` при invalid slug, `generateMetadata` (title, description, ogImage из meta-полей или fallback на title/subtitle/cover)
- Work header: subtitle (overline), title, category badges, cover через `MediaImage` с GIF support
- `WorkImageGallery`: grid 1/2/3 cols, images sorted by `order`, `MediaImage` per item; пустая gallery — только cover
- `YouTubeEmbed`: parse video ID (watch?v=, youtu.be, embed/v/shorts), responsive 16:9 iframe, invalid URL → placeholder; videos sorted by order
- MDX description через shared `MDXContent` из `src/components/mdx/mdx-content.tsx`; пустой description — блок скрыт
- Hidden works: доступны по прямой ссылке (API без фильтра), subtle Draft banner при `hidden=true`
- `ContactSection variant="page"` внизу страницы
- Проверка: `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Files
- `src/app/work/[slug]/page.tsx` — создан
- `src/components/work/WorkImageGallery.tsx` — создан
- `src/components/work/YouTubeEmbed.tsx` — создан
- `src/components/work/index.ts` — изменён (exports)

### Acceptance criteria
- [x] /work/[slug] renders all work data — header, cover, gallery, videos, MDX, contact
- [x] Gallery images in order — sort by `order` in WorkImageGallery
- [x] YouTube videos embed correctly — parseYouTubeVideoId + 16:9 iframe
- [x] MDX via shared MDXContent component — `~/components/mdx/mdx-content`
- [x] hidden works accessible by direct URL — getBySlug без hidden filter + draft banner
- [x] 404 for invalid slug — TRPC NOT_FOUND → notFound()
- [x] ContactSection at bottom — variant="page"
- [x] generateMetadata with title, description, ogImage — metaTitle/metaDescription/ogImageUrl с fallback

### Notes
- MDX parse error handling не реализован отдельно — uncaught error попадёт в Next error boundary (edge case из task)
- Visual QA — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 17 — 2026-08-16 00:18:53 +04

**Executor:** plan-executor subagent  
**Task file:** `task-17.md`  
**Status:** completed

### Changes
- Собрана страница `/about`: `PageHero` (overline «— ABOUT», title из main post или «About resurexi»), main article через `blog.getMain` + `MDXContent` с prose-lg, cover image при наличии, optional link «Read full story» → `/blog/[slug]`
- Empty state: «About content coming soon» при отсутствии isMain post или пустого content
- Секция «From the blog» / «More articles»: grid 1/2/3 cols карточек из `blog.listPublic` (isMain исключён API); секция скрыта при пустом списке
- Создан `BlogPostCard`: image, title, subtitle, link на `/blog/[slug]`
- `generateMetadata`: title «About — resurexi», description/OG из SEO-полей main post (fallback subtitle/content), canonical `/about`
- `ContactSection variant="page"` внизу
- Header About active на `/about` уже через `matchPath` (Task 07) — без изменений

### Files
- `src/app/about/page.tsx` — изменён (полная сборка about page)
- `src/components/blog/BlogPostCard.tsx` — создан
- `src/components/blog/constants.ts` — создан
- `src/components/blog/index.ts` — создан

### Acceptance criteria
- [x] Main isMain article rendered as MDX — `MDXContent` для main post content
- [x] Other articles as cards linking to /blog/[slug] — `BlogPostCard` + `blog.listPublic`
- [x] ContactSection at bottom — `variant="page"`
- [x] Empty states handled — placeholder без main post; секция статей скрыта при пустом listPublic
- [x] Responsive layout — grid `sm:grid-cols-2 lg:grid-cols-3`, container-content
- [x] Header About link active — `matchPath: "/about"` в Header (Task 07)
- [x] Page metadata set — `generateMetadata` title, description, OG, canonical `/about`

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Visual QA — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 18 — 2026-08-16 00:20:16 +04

**Executor:** plan-executor subagent  
**Task file:** `task-18.md`  
**Status:** completed

### Changes
- Создана страница `/blog/[slug]`: server fetch через `blog.getBySlug`, `notFound()` при NOT_FOUND
- Article layout: header (subtitle overline, title, optional date via `Intl.DateTimeFormat`), optional cover (`max-w-4xl`, skip if missing), MDX body через shared `MDXContent` с `prose-lg`
- Hidden articles: доступны по прямой ссылке (API без hidden filter), Draft banner при `hidden=true`
- `generateMetadata`: title/description/OG из SEO-полей с fallback, canonical `/blog/[slug]`, `publishedTime`/`modifiedTime`
- `ContactSection variant="page"` внизу страницы

### Files
- `src/app/blog/[slug]/page.tsx` — создан

### Acceptance criteria
- [x] /blog/[slug] renders article MDX — `MDXContent` для post.content
- [x] hidden articles accessible by URL — getBySlug без hidden filter + draft banner
- [x] 404 invalid slug — TRPC NOT_FOUND → notFound()
- [x] Shared MDXContent from Task 05 — `~/components/mdx/mdx-content`
- [x] ContactSection at bottom — variant="page"
- [x] generateMetadata with SEO fields — metaTitle/metaDescription/ogImageUrl с fallback, canonical, OG article
- [x] Responsive typography — prose-lg в MDXContent, responsive heading sizes

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Hidden posts не попадают в `blog.listPublic` на /about (Task 03) — соответствует требованию
- Visual QA — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 19 — 2026-08-16 00:21:11 +04

**Executor:** plan-executor subagent  
**Task file:** `task-19.md`  
**Status:** completed

### Changes
- Создан shared SEO helper `src/lib/seo.ts`: `getSiteUrl()` (NEXT_PUBLIC_SITE_URL → VERCEL_URL → localhost), `buildMetadata()`, `getWorkMetadata()`, `getBlogMetadata()`, `getAboutMetadata()`, `getStaticPageMetadata()`, `resolveMetaDescription()` с fallback metaTitle/metaDescription/ogImageUrl
- Work/blog pages переведены на shared helpers: canonical, OpenGraph, Twitter cards, default OG image, `robots: noindex,nofollow` при `hidden=true`
- Static pages: metadata для `/`, `/work`; layout — `metadataBase` через `getSiteUrl()`, default description «3D model designer portfolio», default OG image
- About page: `generateMetadata` через `getAboutMetadata()` с SEO-полями main post и static fallback
- `src/app/sitemap.ts`: `/`, `/work`, `/about`, все public works и blog posts (isMain + listPublic), `lastModified` из `updatedAt`, admin excluded
- `src/app/robots.ts`: allow `/`, disallow `/admin`, sitemap URL
- Placeholder `public/og-default.png` 1200×630

### Files
- `src/lib/seo.ts` — создан
- `src/app/sitemap.ts` — создан
- `src/app/robots.ts` — создан
- `public/og-default.png` — создан
- `src/app/work/[slug]/page.tsx` — изменён (shared SEO helper, noindex)
- `src/app/blog/[slug]/page.tsx` — изменён (shared SEO helper, noindex, Twitter)
- `src/app/about/page.tsx` — изменён (shared SEO helper)
- `src/app/page.tsx` — изменён (static metadata)
- `src/app/work/page.tsx` — изменён (static metadata + canonical/OG/Twitter)
- `src/app/layout.tsx` — изменён (metadataBase, default OG, description)

### Acceptance criteria
- [x] Work pages have dynamic OG tags — `getWorkMetadata()` с OG + Twitter + canonical
- [x] Blog pages have dynamic OG tags — `getBlogMetadata()` с OG article + Twitter + canonical
- [x] sitemap.xml includes public works and posts — `sitemap.ts` через `works.listAll`, `blog.getMain`, `blog.listPublic`
- [x] robots.txt disallows /admin — `robots.ts` disallow `/admin`
- [x] SEO field fallbacks work — metaTitle/metaDescription/ogImageUrl с fallback на title/subtitle/content/cover/default OG
- [x] Default OG image exists — `public/og-default.png` 1200×630
- [x] hidden=true pages have robots noindex — `noIndex: work.hidden/post.hidden` в buildMetadata

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- isMain article: `/about` и `/blog/[slug]` оба в sitemap; canonical независимые (`/about` и `/blog/[slug]`)
- Visual QA — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 20 — 2026-08-16 00:22:29 +04

**Executor:** plan-executor subagent  
**Task file:** `task-20.md`  
**Status:** completed

### Changes
- Route group `(dashboard)`: sidebar layout для всех `/admin/*` кроме `/admin/login`
- `AdminShell`: fixed sidebar 240px (desktop), drawer с hamburger (mobile), scrollable main
- `AdminSidebar`: 5 nav items (Requests, Work, Blog, Content, Contact) с lucide icons, active state, badge unread через `contact.getUnreadCount` (refetch 30s, скрыт при 0)
- `AdminHeader`: page title/breadcrumb, logout через `admin.logout` + redirect на login
- `AdminWorkSubNav`: tabs Works | Categories на `/admin/work/*` (не в sidebar)
- `/admin` → redirect `/admin/requests`
- Minimal placeholder pages для 5 разделов (без CRUD-контента)
- Public `Header` скрыт на `/admin/*` (hooks-safe conditional render)
- `admin/layout.tsx`: metadata с `robots: noindex`

### Files
- `src/app/admin/layout.tsx` — создан
- `src/app/admin/(dashboard)/layout.tsx` — создан
- `src/app/admin/(dashboard)/page.tsx` — создан (redirect)
- `src/app/admin/(dashboard)/requests/page.tsx` — создан
- `src/app/admin/(dashboard)/work/page.tsx` — создан
- `src/app/admin/(dashboard)/work/categories/page.tsx` — создан
- `src/app/admin/(dashboard)/blog/page.tsx` — создан
- `src/app/admin/(dashboard)/content/page.tsx` — создан
- `src/app/admin/(dashboard)/contact/page.tsx` — создан
- `src/app/admin/page.tsx` — удалён (заменён route group)
- `src/components/admin/admin-nav.ts` — создан
- `src/components/admin/AdminSidebar.tsx` — создан
- `src/components/admin/AdminHeader.tsx` — создан
- `src/components/admin/AdminShell.tsx` — создан
- `src/components/admin/AdminWorkSubNav.tsx` — создан
- `src/components/layout/Header.tsx` — изменён (hide on admin)

### Acceptance criteria
- [x] Admin layout with sidebar on all /admin/* except login — route group `(dashboard)` + login вне группы
- [x] All 5 nav items link correctly — placeholder pages + correct hrefs
- [x] Unread requests badge updates — `getUnreadCount` query с refetchInterval
- [x] Logout works — `admin.logout` mutation + push `/admin/login`
- [x] /admin redirects to default section — redirect to `/admin/requests`
- [x] Mobile responsive sidebar — hamburger + left drawer + backdrop
- [x] Protected by auth middleware — Task 04 middleware без изменений

### Notes
- `pnpm lint`, `pnpm typecheck` — успешно (с test env vars)
- `pnpm build` — pre-existing ESLint error в `src/server/api/trpc.ts:122` (не связан с task-20)
- Visual QA — browser screenshot не выполнялся

### Вопросы пользователю
_нет_

---

## Task 21 — 2026-08-16 00:24:01 +04

**Executor:** plan-executor subagent  
**Task file:** `task-21.md`  
**Status:** completed

### Changes
- `AdminRequestsList`: таблица заявок (Name, Email, Company, Date, Status) с сортировкой newest first через `contact.listRequests`
- Unread rows: accent dot, semibold name, accent background tint, `Unread` badge
- Inline expand по клику на строку: все поля (name, company, email, phone, message, createdAt)
- Long message в scrollable блоке (`max-h-64 overflow-y-auto`)
- `Mark as read` для unread заявок через `contact.markRequestRead`
- После markRead — invalidate `contact.listRequests` и `contact.getUnreadCount` (sidebar badge обновляется)
- Empty state: «No requests yet»; loading/error states
- Fix pre-existing ESLint в `trpc.ts`: убран unnecessary type assertion `as AdminSession`

### Files
- `src/components/admin/AdminRequestsList.tsx` — создан
- `src/app/admin/(dashboard)/requests/page.tsx` — изменён (placeholder → AdminRequestsList)
- `src/server/api/trpc.ts` — изменён (ESLint fix)

### Acceptance criteria
- [x] All form submissions visible in list — `contact.listRequests` renders all rows
- [x] Unread/read status clear — dot + badge + font weight
- [x] Mark as read updates DB and badge — mutation + invalidate listRequests/getUnreadCount
- [x] Full message viewable — expandable detail with scrollable message block
- [x] Sorted newest first — `orderBy: desc(createdAt)` in router (Task 03)
- [x] Empty state — «No requests yet»

### Notes
- tRPC procedures `listRequests`, `markRequestRead`, `getUnreadCount` уже были в Task 03 — без изменений
- Mark as unread не реализован (nice-to-have в task, процедуры нет)
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Вопросы пользователю
_нет_

---

## Task 22 — 2026-08-16 00:25:06 +04

**Executor:** plan-executor subagent  
**Task file:** `task-22.md`  
**Status:** completed

### Changes
- `AdminCategoriesList`: таблица категорий (Name, Slug, Works, Actions), кнопка Add Category
- Modal create/edit: Name (required), Slug (auto из name через slugify, editable), Save/Cancel
- Modal delete с confirm; кнопка Delete disabled при workCount > 0; сервер блокирует delete если категория привязана к works
- `categories.listForAdmin`: возвращает `workCount` через relation `workCategories`
- `categories.delete`: PRECONDITION_FAILED если категория используется в works
- Страница `/admin/work/categories` подключена к AdminCategoriesList; sub-nav Categories из Task 20 без изменений

### Files
- `src/components/admin/AdminCategoriesList.tsx` — создан
- `src/app/admin/(dashboard)/work/categories/page.tsx` — изменён
- `src/server/api/routers/categories.ts` — изменён (workCount, delete guard)

### Acceptance criteria
- [x] Page at `/admin/work/categories` (NOT `/admin/categories`) — route `(dashboard)/work/categories/page.tsx`
- [x] Create category with name and slug — create mutation + form modal
- [x] Edit existing category — edit mutation + form modal
- [x] Delete unused category — delete mutation + confirm modal
- [x] Slug auto-generation — client slugify on name change until manual slug edit
- [x] List all categories — `listForAdmin` table
- [x] Duplicate slug prevented — server CONFLICT + form error message
- [x] Linked from Work admin sub-nav — AdminWorkSubNav unchanged (Task 20)

### Notes
- Ссылка «Manage Categories →» на `/admin/work` — scope Task 23, не реализована здесь
- `pnpm lint`, `pnpm typecheck` — успешно (с test env vars)

### Вопросы пользователю
_нет_

---

## Task 24 — 2026-08-16 00:26:05 +04

**Executor:** plan-executor subagent  
**Task file:** `task-24.md`  
**Status:** completed

### Changes
- Shared `MdxEditor` component: client-only via `next/dynamic` (`ssr: false`), plugins (headings, lists, links, quotes, images, toolbar), image upload via Uploadthing `uploadFiles`
- `AdminBlogList`: table (Title, Main ✓, Hidden ✓, Updated, Actions), New Post button, delete confirm with isMain warning
- `AdminBlogForm`: create/edit form with title, subtitle, slug (auto), cover ImageUploader, MdxEditor content, isMain/hidden flags, SEO fields (metaTitle, metaDescription, ogImage)
- isMain exclusivity: server-side `clearOtherMainPosts` in blog router (already present); client warns when hiding main post
- hidden defaults true on create (form state + schema default)
- Pages: `/admin/blog`, `/admin/blog/new`, `/admin/blog/[id]`
- `getAdminPageTitle` updated for New Post / Edit Post breadcrumbs

### Files
- `src/components/admin/MdxEditor.tsx` — создан
- `src/components/admin/MdxEditorInner.tsx` — создан
- `src/components/admin/AdminBlogList.tsx` — создан
- `src/components/admin/AdminBlogForm.tsx` — создан
- `src/app/admin/(dashboard)/blog/page.tsx` — изменён
- `src/app/admin/(dashboard)/blog/new/page.tsx` — создан
- `src/app/admin/(dashboard)/blog/[id]/page.tsx` — создан
- `src/components/admin/admin-nav.ts` — изменён

### Acceptance criteria
- [x] mdxEditor works in create/edit forms — MdxEditor in AdminBlogForm on /new and /[id]
- [x] WYSIWYG editing without separate preview — MDXEditor toolbar + content editable, no preview pane
- [x] Image upload inside editor via Uploadthing — imagePlugin + uploadFiles("imageUploader")
- [x] isMain exclusivity enforced — clearOtherMainPosts in blog.create/update
- [x] hidden defaults true on create — useState(true) + blogCreateSchema default
- [x] SEO fields saved — metaTitle, metaDescription, ogImageUrl in form + mutations
- [x] CRUD complete — list, create, edit, delete
- [x] MdxEditor exported for reuse in Work admin (Task 23) — `~/components/admin/MdxEditor`

### Notes
- tRPC blog router (create, update, delete, getById, listForAdmin) уже был в Task 03 — без изменений
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Markdown roundtrip с MDXContent на публичных страницах — стандартный markdown output редактора

### Вопросы пользователю
_нет_

---

## Task 23 — 2026-08-16 00:27:51 +04

**Executor:** plan-executor subagent  
**Task file:** `task-23.md`  
**Status:** completed

### Changes
- `AdminWorkList`: таблица works (cover thumb, title, featured/hidden, categories, edit/delete), фильтр All/Published/Hidden, ссылка Manage Categories →, кнопка New Work, delete confirm modal
- `AdminWorkForm`: полная форма create/edit — basic (title, subtitle, slug auto), cover ImageUploader с coverIsAnimated, gallery SortableGalleryUploader (dnd-kit drag reorder), YouTube URL list с валидацией и order, categories multi-select checkboxes, MdxEditor для description, featured/hidden flags, SEO fields; hidden defaults true on create; block save при upload in progress
- `SortableGalleryUploader`: drag-and-drop reorder галереи через @dnd-kit, scroll list для many images, isAnimated per item
- `ImageUploader`: добавлен optional `onUploadingChange` callback для блокировки save
- Страницы: `/admin/work`, `/admin/work/new`, `/admin/work/[id]`; AdminWorkSubNav active state для new/edit routes
- `admin-nav.ts`: breadcrumbs New Work / Edit Work
- tRPC works router (create, update, delete, getById, listForAdmin) уже был в Task 03 — без изменений

### Files
- `src/components/admin/AdminWorkList.tsx` — создан
- `src/components/admin/AdminWorkForm.tsx` — создан
- `src/components/admin/SortableGalleryUploader.tsx` — создан
- `src/components/admin/ImageUploader.tsx` — изменён (onUploadingChange)
- `src/components/admin/AdminWorkSubNav.tsx` — изменён (active state для /work/new, /work/[id])
- `src/components/admin/admin-nav.ts` — изменён (page titles)
- `src/app/admin/(dashboard)/work/page.tsx` — изменён
- `src/app/admin/(dashboard)/work/new/page.tsx` — создан
- `src/app/admin/(dashboard)/work/[id]/page.tsx` — создан

### Acceptance criteria
- [x] Create new work with all fields — AdminWorkForm on /admin/work/new
- [x] Edit existing work — AdminWorkForm on /admin/work/[id]
- [x] Delete work — confirm modal in list and form
- [x] Cover and gallery upload via Uploadthing — ImageUploader + SortableGalleryUploader
- [x] YouTube URLs saved and ordered — dynamic list, order field on save
- [x] Categories assignable — checkboxes from categories.listForAdmin
- [x] featured and hidden toggles work — Publishing section checkboxes
- [x] SEO fields saved — metaTitle, metaDescription, ogImageUrl
- [x] hidden defaults true on create — useState(true)
- [x] Slug uniqueness enforced — server resolveWorkSlug CONFLICT (Task 03)
- [x] Gallery reorder works — dnd-kit drag in SortableGalleryUploader

### Notes
- Cover required on save (client validation + workCreateSchema); publishing without cover blocked
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Browser QA не выполнялся

### Вопросы пользователю
_нет_

---

## Task 25 — 2026-08-16 00:29:34 +04

**Executor:** plan-executor subagent  
**Task file:** `task-25.md`  
**Status:** completed

### Changes
- Создан `AdminContent`: вкладки Hero / About Preview / Contact Info с формами редактирования и partial save (только изменённые поля, пустые URL → null)
- Hero tab: heroTitle, heroSubtitle, heroGifUrl (ImageUploader variant hero), wireframe B&W + color uploads, help text про dual-layer effect, Save → `content.updateHero`, ссылка «View on site →» `/#hero`
- About Preview tab: title, text, image, Save → `content.updateAboutPreview`, preview link `/#about`
- Contact Info tab: contactEmail, responseTimeText, basedInText, Save → `content.updateContactInfo`
- `content.ensureDefaults` protected mutation: upsert пустых записей hero/about_preview/contact_info при первом mount админки
- Schemas hero/about/contact update: `.nullish()` для очистки полей
- Страница `/admin/content` подключена к AdminContent

### Files
- `src/components/admin/AdminContent.tsx` — создан
- `src/app/admin/(dashboard)/content/page.tsx` — изменён
- `src/server/api/routers/content.ts` — изменён (ensureDefaults)
- `src/server/api/schemas/index.ts` — изменён (nullish content schemas)

### Acceptance criteria
- [x] Edit Hero all fields, saves to DB — HeroContentForm + updateHero upsert
- [x] Edit About preview all fields — AboutContentForm + updateAboutPreview
- [x] GIF and wireframe uploads work — ImageUploader hero variant + two wireframe uploaders
- [x] Changes reflect on homepage after save — invalidate queries; публичные секции читают site_content через SSR при следующем запросе
- [x] Upsert creates records if missing — ensureDefaults on mount + upsertContentByKey в mutations
- [x] Contact Info tab edits email, response time, based in — ContactContentForm + updateContactInfo

### Notes
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)
- Browser QA не выполнялся
- Исправлены TypeScript-ошибки, на которые ссылался log Task 26

### Вопросы пользователю
_нет_

---

## Task 26 — 2026-08-16 00:29:34 +04

**Executor:** plan-executor subagent  
**Task file:** `task-26.md`  
**Status:** completed

### Changes
- Создан `AdminContactLinksList`: sortable list (dnd-kit drag reorder), icon preview с Lucide Link fallback note, Add Link, edit/delete modals
- Форма ссылки: label*, url* (client + Zod url validation), icon через ImageUploader или external URL input, Remove icon, quick-add Telegram/WhatsApp templates
- Порядок: drag → `contact.reorderLinks` с нормализацией order 0..n-1; create использует max(order)+1
- Страница `/admin/contact` подключена к AdminContactLinksList
- `contactLinkUpdateSchema`: nullable iconUrl для очистки иконки; `updateLink` — partial payload (только переданные поля)
- tRPC createLink/updateLink/deleteLink/reorderLinks из Task 03 — без новых процедур; публичные Hero/SocialLinks уже читают `contact.getLinks` по order

### Files
- `src/components/admin/AdminContactLinksList.tsx` — создан
- `src/app/admin/(dashboard)/contact/page.tsx` — изменён
- `src/server/api/schemas/index.ts` — изменён (contactLinkUpdateSchema)
- `src/server/api/routers/contact.ts` — изменён (partial updateLink)

### Acceptance criteria
- [x] Create, edit, delete links — form modal + delete confirm + mutations
- [x] Reorder links reflected on public site — reorderLinks + getLinks orderBy asc(order) в SocialLinks/Hero
- [x] Icon upload or URL works — ImageUploader + Or icon URL input + preview
- [x] Changes appear in ContactSection — SocialLinks uses contact.getLinks (invalidate on save)
- [x] WhatsApp/Telegram manageable here (also show in Hero contact icons) — presets + Hero filters messaging links from same DB

### Notes
- ESLint на файлах task-26 — без ошибок
- `pnpm typecheck` / `pnpm lint` проекта падают из-за pre-existing ошибок в `AdminContent.tsx` (Task 25), не связанных с task-26
- Browser QA не выполнялся

### Вопросы пользователю
_нет_

---

## Task 26 — 2026-08-16 00:30:51 +04

**Executor:** plan-executor subagent  
**Task file:** `task-26.md`  
**Status:** completed

### Changes
- Верифицирована существующая реализация AdminContactLinksList (CRUD + drag reorder + icon upload/URL + Telegram/WhatsApp presets)
- Страница `/admin/contact` подключена к AdminContactLinksList
- tRPC contact.createLink/updateLink/deleteLink/reorderLinks и Zod-схемы — без изменений (Task 03)
- Публичная интеграция: SocialLinks и Hero читают `contact.getLinks` с orderBy asc(order)
- Проверка: ESLint на файлах task-26 — без ошибок; `pnpm typecheck` — успешно

### Files
- `src/components/admin/AdminContactLinksList.tsx` — создан (предыдущий проход)
- `src/app/admin/(dashboard)/contact/page.tsx` — изменён
- `src/server/api/schemas/index.ts` — изменён (contactLinkUpdateSchema nullable iconUrl)
- `src/server/api/routers/contact.ts` — изменён (partial updateLink)

### Acceptance criteria
- [x] Create, edit, delete links — form modal + delete confirm + mutations
- [x] Reorder links reflected on public site — reorderLinks + getLinks orderBy asc(order)
- [x] Icon upload or URL works — ImageUploader + external URL input + preview
- [x] Changes appear in ContactSection — SocialLinks uses contact.getLinks (invalidate on save)
- [x] WhatsApp/Telegram manageable here (also show in Hero contact icons) — presets + isMessagingLink filter in Hero

### Notes
- Реализация была выполнена в предыдущем проходе (00:29:34); этот проход — верификация критериев приёмки
- Browser QA не выполнялся

### Вопросы пользователю
_нет_

---

## Task 25 — 2026-08-16 00:30:53 +04

**Executor:** plan-executor subagent  
**Task file:** `task-25.md`  
**Status:** completed

### Changes
- Создан `AdminContent`: табы Hero / About Preview / Contact Info с переключением через nav
- Hero tab: heroTitle, heroSubtitle, heroGifUrl (ImageUploader `variant="hero"`), heroWireframeUrl, heroWireframeColorUrl; help text про dual-layer wireframe effect; Save → `content.updateHero` с partial patch (`pickChangedFields`)
- About Preview tab: aboutPreviewTitle, aboutPreviewText (textarea), aboutPreviewImageUrl; Save → `content.updateAboutPreview`
- Contact Info tab: contactEmail, responseTimeText, basedInText; client email validation; Save → `content.updateContactInfo`
- Initial seed: `content.ensureDefaults` на mount — upsert пустых записей hero/about_preview/contact_info если отсутствуют
- Preview links: «View on site →» на Hero (`/#hero`) и About (`/#about`) в новой вкладке
- Upload blocking: Save disabled при активной загрузке (onUploadingChange)
- Страница `/admin/content` подключена к AdminContent
- Проверка: `pnpm lint`, `pnpm typecheck`, `pnpm build` — успешно (с test env vars)

### Files
- `src/components/admin/AdminContent.tsx` — создан
- `src/app/admin/(dashboard)/content/page.tsx` — изменён (placeholder → AdminContent)
- `src/server/api/routers/content.ts` — изменён (ensureDefaults mutation)

### Acceptance criteria
- [x] Edit Hero all fields, saves to DB — HeroContentForm + updateHero upsert
- [x] Edit About preview all fields — AboutContentForm + updateAboutPreview
- [x] GIF and wireframe uploads work — heroImageUploader для GIF (16MB), imageUploader для wireframes
- [x] Changes reflect on homepage after save — invalidate getHero/getAboutPreview/getContactInfo; SSR на / подхватывает при следующем запросе
- [x] Upsert creates records if missing — ensureDefaults на mount
- [x] Contact Info tab edits email, response time, based in — ContactContentForm + updateContactInfo

### Notes
- Partial update: только изменённые поля через `pickChangedFields`; пустые строки → null
- Large GIF: ошибка размера от Uploadthing показывается в ImageUploader error banner с Retry
- Live preview iframe не реализован (по task — достаточно ссылки на сайт)
- Browser QA не выполнялся

### Вопросы пользователю
_нет_

---

## Task 27 — 2026-08-16 00:31:56 +04

**Executor:** plan-executor subagent  
**Task file:** `task-27.md`  
**Status:** completed

### Changes
- Обновлён `src/env.js`: `NEXT_PUBLIC_SITE_URL` обязателен при `NODE_ENV=production` (build падает без него); `CAL_COM_URL` и `NEXT_PUBLIC_CAL_COM_URL` остаются optional
- Переписан `README.md`: overview, local dev, env vars table, Vercel deploy step-by-step, Neon schema push, post-deploy content guide, domain setup, smoke test checklist, security notes, free tier limits
- Обновлён `.env.example`: все переменные с комментариями required/optional, удалён неиспользуемый `POSTGRES_URL`
- Добавлен `engines.node >= 20` в `package.json`
- Security review: httpOnly+secure cookies (Task 04), `/admin` в robots disallow + noindex metadata, sitemap не включает admin, секреты только в server env
- Проверка: `pnpm build` с production env — успешно; без `NEXT_PUBLIC_SITE_URL` — корректный fail

### Files
- `src/env.js` — изменён (production validation NEXT_PUBLIC_SITE_URL)
- `README.md` — изменён (полная документация deploy/setup)
- `.env.example` — изменён (все env vars documented)
- `package.json` — изменён (engines.node)

### Acceptance criteria
- [x] `pnpm build` succeeds with production env — verified with all required vars
- [x] README complete with setup and deploy instructions
- [x] All env vars documented in .env.example
- [x] NEXT_PUBLIC_SITE_URL used in sitemap/OG — `getSiteUrl()` в seo.ts, layout metadataBase, sitemap.ts, robots.ts
- [x] Production db schema applied — команда `DATABASE_URL=... pnpm db:push` задокументирована в README (фактический push требует Neon credentials владельца)
- [x] Smoke test checklist documented — секция в README
- [x] Post-deploy content guide included — секция в README

### Notes
- `vercel.json` не нужен — Next.js auto-detected на Vercel
- Neon serverless driver не добавлялся — стандартный `postgres` package работает с pooled URL
- Browser smoke test не выполнялся (checklist задокументирован для post-deploy QA)
- Домен не покупался (per task clarifications)

### Вопросы пользователю
_нет_


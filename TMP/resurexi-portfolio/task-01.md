# Task 01: Инициализация T3-проекта

## Описание

Создать новый проект с нуля через `create-t3-app` со всеми необходимыми опциями для портфолио resurexi. Настроить базовую структуру каталогов, TypeScript strict mode, ESLint/Prettier, env-шаблон. Проект должен успешно запускаться локально (`pnpm dev`) с пустой главной страницей.

## Предусловия

**Зависимости от других задач:** нет — первая задача.

**Необходимые инструменты:**

- Node.js 20+
- pnpm
- Git (репозиторий уже существует или инициализируется)

## План выполнения

### Шаг 1: Создание проекта

**Что делать:**

- Запустить `create-t3-app` в корне workspace (или создать в подпапке и перенести, если repo уже инициализирован)
- Выбрать опции:
  - **Next.js** (App Router)
  - **TypeScript**
  - **Tailwind CSS**
  - **tRPC**
  - **Drizzle ORM**
  - **PostgreSQL**
  - **App Router** (не Pages)
  - ESLint — да
- Package manager: **pnpm**

**Файлы:**

- Корневая структура T3: `src/app/`, `src/server/`, `src/trpc/`, `drizzle/`

### Шаг 2: Дополнительные зависимости

**Что делать:**

Установить пакеты, которые понадобятся в следующих задачах (можно сразу, чтобы не возвращаться):

- `next-themes` — темизация
- `@calcom/embed-react` — Cal.com popup
- `uploadthing` + `@uploadthing/react` — загрузка медиа
- `@mdxeditor/editor` — rich text для блога и работ (обязателен с v1)
- `react-masonry-css` — masonry-галерея
- `lucide-react` — иконки (fallback Link и UI)
- `zod` — уже в T3, проверить наличие
- `next-mdx-remote` — **единственный** пакет для server-side рендера MDX на публичных страницах (не дублировать с @next/mdx)
- `@tailwindcss/typography` — prose-стили для MDX
- `@dnd-kit/core` + `@dnd-kit/sortable` — reorder галереи в админке (Task 23)
- `slugify` — генерация slug

**На что обратить внимание — mdxEditor contingency:**

1. Проверить совместимость `@mdxeditor/editor` с React 19 / Next.js 15
2. Если несовместим — **pin React 18** через overrides в package.json (предпочтительный fallback)
3. Альтернатива крайняя: `@uiw/react-md-editor` — только если mdxEditor полностью блокирует сборку; зафиксировать решение в log.md
4. Не откладывать проверку — выполнить `pnpm build` с mdxEditor до Task 24

### Шаг 3: Env-шаблон

**Что делать:**

Создать `.env.example` с переменными:

```
DATABASE_URL=
ADMIN_PASSWORD=
SESSION_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
CAL_COM_URL=              # optional
NEXT_PUBLIC_CAL_COM_URL=  # optional
NEXT_PUBLIC_SITE_URL=
```

Добавить `.env` в `.gitignore` (должен быть по умолчанию в T3).

### Шаг 4: Базовая структура каталогов

**Что делать:**

Создать заготовки папок (пустые index или .gitkeep):

```
src/components/ui/          — примитивы (Button, Input, Modal)
src/components/layout/        — Header, WaveDivider
src/components/sections/    — Hero, FeaturedWork, AboutPreview, Contact
src/components/admin/         — компоненты админки
src/components/work/          — WorkCard, WorkGallery, MasonryGrid
src/components/blog/          — BlogCard
src/components/mdx/           — MDXContent (shared renderer)
src/lib/                      — утилиты (slug, cn)
```

### Шаг 5: Проверка запуска

**Что делать:**

- `pnpm install`
- `pnpm dev` — приложение открывается на localhost
- `pnpm lint` — без ошибок
- `pnpm build` — успешная сборка (даже с пустой БД — может потребовать DATABASE_URL)

## Граничные случаи

- Если repo уже содержит файлы планирования (`план портфолио/`) — не удалять их, T3 создавать в корне поверх или аккуратно merge
- Если `create-t3-app` интерактивен — использовать флаги CLI для non-interactive режима

## Критерии приёмки

- [ ] T3-проект создан с Next.js, Tailwind, tRPC, Drizzle, Postgres
- [ ] Все дополнительные зависимости установлены
- [ ] `.env.example` содержит все переменные из концепта
- [ ] Структура каталогов компонентов создана
- [ ] `pnpm dev` запускается без ошибок
- [ ] `pnpm build` проходит успешно
- [ ] `pnpm lint` без ошибок

## Дополнительные заметки

**Не делай:**

- Не настраивай БД-схему — это Task 02
- Не создавай UI-компоненты — только структура папок

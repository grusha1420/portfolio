# Task 05: Дизайн-система и темизация

## Описание

Настроить CSS-переменные для цветов сегментов, светлой/тёмной темы, типографики. Подключить next-themes с default `system`. Создать базовые UI-примитивы: Button, Input, Textarea, Label, Modal, Badge, Card — в стиле референсов YNG/Kenney (rounded, clean sans-serif).

## Предусловия

**Зависимости:**

- Task 01 — Tailwind настроен

## План выполнения

### Шаг 1: CSS-переменные в globals.css

**Что делать:**

Определить переменные (placeholder-значения, легко менять):

```css
/* Base */
--background, --foreground, --muted, --border

/* Segment colors — чередование */
--segment-default-bg
--segment-accent-a-bg, --segment-accent-a-fg
--segment-accent-b-bg, --segment-accent-b-fg

/* Brand accent (CTA buttons — orange как YNG) */
--accent, --accent-foreground

/* Card, input */
--card-bg, --input-border
```

Dark mode overrides в `.dark { ... }`.

### Шаг 2: next-themes

**Файл:** `src/app/layout.tsx`

**Что делать:**

- ThemeProvider с attribute="class", defaultTheme="system", enableSystem
- suppressHydrationWarning на html

### Шаг 3: Tailwind config

**Что делать:**

- Extend colors через CSS variables: `bg-background`, `text-foreground`, `bg-segment-accent-a`
- Font: Inter или Geist (T3 default) — placeholder, без брендбука
- Border radius: rounded-lg / rounded-xl для карточек (референс YNG)
- Container max-width для контента

### Шаг 4: UI-примитивы

**Каталог:** `src/components/ui/`

**Button:**

- Variants: primary (accent orange), secondary (outline), ghost
- Sizes: sm, md, lg
- Rounded-full для CTA как YNG «Start a Project»

**Input / Textarea / Label:**

- Стили как contact.png — label сверху, border subtle, rounded
- Required marker (*) accent color

**Modal:**

- Backdrop blur/darken
- Center panel, close button (×)
- База для Cal.com и будущих confirm dialogs

**Card:**

- Для work/blog cards — image + metadata

**Badge:**

- Pill-shaped tags для категорий (work.png)

### Шаг 5: MDX-инфраструктура (shared)

**Файлы:**

- `src/components/mdx/MDXContent.tsx` — server component, рендер MDX-строки через `next-mdx-remote/rsc`
- Подключить `@tailwindcss/typography` — класс `prose prose-lg dark:prose-invert`

**Что делать:**

- Единый компонент для work description, blog posts, about main article
- Поддержка: headings, lists, links, images, blockquotes
- **MDX components map:** custom `img` → MediaImage (GIF support); стандартные `a`, `h1-h6`, etc.
- Используется в Task 16, 17, 18 — **создаётся здесь, не дублировать**

**Утилита для медиа:**

- `src/components/ui/MediaImage.tsx` — обёртка для изображений/GIF:
  - Props: `src`, `alt`, **`isAnimated?: boolean`**
  - `isAnimated=true` → `<img unoptimized>` (анимация GIF)
  - `isAnimated=false` или undefined → `next/image`
  - **Не полагаться на `.gif` в URL** — Uploadthing CDN не сохраняет расширение; флаг `isAnimated` хранится в БД (Task 02) и передаётся из upload (Task 09)

### Шаг 6: Theme toggle

**Компонент:** `ThemeToggle` — sun/moon icon в Header (Task 07)

## Граничные случаи

- FOUC при system theme — next-themes handled
- SSR: компоненты не должны зависеть от window.matchMedia на сервере

## Критерии приёмки

- [ ] CSS-переменные для всех segment colors и theme
- [ ] next-themes работает: system/light/dark
- [ ] UI-примитивы: Button, Input, Textarea, Label, Modal, Badge, Card
- [ ] MDXContent shared component работает с next-mdx-remote
- [ ] MediaImage корректно анимирует GIF
- [ ] Tailwind использует CSS variables
- [ ] Placeholder-палитра визуально coherent (не raw defaults)
- [ ] Нет ошибок линтера

## Дополнительные заметки

**Ориентиры:**

- YNG.CGI — orange accent #FF5722-ish, cream background, dark footer
- Kenney — purple/orange segment blocks, white base
- Цвета сегментов — placeholder, структура важнее точных hex

**Не делай:**

- Не верстай секции — только design tokens и primitives

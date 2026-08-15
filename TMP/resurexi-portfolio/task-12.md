# Task 12: About-секция (превью на главной)

## Описание

Краткий About-сегмент на главной странице: заголовок, текст средней длины, опциональное изображение, кнопка «Learn more» → /about. Контент из site_content (about_preview). **Фон: default (общий)** — по концепту «общий → A → **общий** → B».

## Предусловия

**Зависимости:**

- Task 03 — content.getAboutPreview
- Task 05 — design system

## Компоненты для ориентира

**YNG about preview pattern** — краткий intro на главной; полная страница about.png для tone (story, philosophy sections) но на главной только teaser.

**Концепт:** «информация средней длины» + кнопка на /about

## План выполнения

### Шаг 1: AboutPreview section

**Файл:** `src/components/sections/AboutPreview.tsx`

**Структура:**

- id="about"
- Two-column layout desktop: text left, image right (or stacked mobile)
- Fields: aboutPreviewTitle, aboutPreviewText, aboutPreviewImageUrl
- CTA Button Link to /about — «Learn more» or «Read my story»
- Section label optional: «02 — ABOUT»

### Шаг 2: Segment styling

**Что делать:**

- **Default background** (`--background`) — не ColoredSegment, без собственных WaveDivider
- Переход от Featured (accent A) — нижняя волна Featured ведёт в default About

### Шаг 3: Data

**Что делать:**

- Server fetch content.getAboutPreview
- Placeholder text about 3D modeling designer if empty

## Граничные случаи

- No image — text-only layout full width
- Very long text — truncate not needed, «medium length» is admin responsibility

## Критерии приёмки

- [ ] Displays title, text, optional image from DB
- [ ] Button navigates to /about
- [ ] Default background segment (не цветной)
- [ ] id="about" for header scroll
- [ ] Responsive two-column / stacked
- [ ] Placeholder when content empty

## Дополнительные заметки

**Не делай:**

- Full about page content — Task 17
- Don't pull isMain blog post here — separate site_content fields

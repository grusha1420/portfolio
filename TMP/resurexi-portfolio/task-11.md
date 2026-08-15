# Task 11: Featured Work-секция

## Описание

Секция «Featured Work» на главной: галерея карточек работ с флагом featured, cover-изображение, заголовок, подзаголовок, pill-badges категорий, клик ведёт на /work/[slug]. Кнопка «View all work» → /work. Masonry или grid layout по референсу YNG.

## Предусловия

**Зависимости:**

- Task 03 — works.listFeatured
- Task 05 — Card, Badge, **MediaImage**
- Task 06 — **ColoredSegment**, WaveDivider

## Компоненты для ориентира

**YNG.CGI** (`Fullpage YNG.png`)

- Section label: «01 — FEATURED WORK» (orange small caps)
- Title: «Selected renders & films»
- 2-column grid of project cards
- Each card: large rounded image, client name small caps, project title bold, category pills

## План выполнения

### Шаг 1: WorkCard component

**Файл:** `src/components/work/WorkCard.tsx`

**Props:** work with coverImageUrl, title, subtitle, categories, slug

**Что делать:**

- Link wrapper to /work/[slug]
- Cover via **MediaImage** with **coverIsAnimated** from DB (не `.gif` в URL)
- Image aspect ratio ~16/10 or variable like YNG
- rounded-xl overflow hidden
- Hover: subtle scale or overlay
- Category badges as pills (grey outline style from work.png)

### Шаг 2: FeaturedWork section

**Файл:** `src/components/sections/FeaturedWork.tsx`

**Структура:**

- id="featured-work"
- Section header: label + title + «View all work →» link button
- Grid: 2 cols desktop, 1 col mobile
- Fetch works.listFeatured via server component or tRPC
- Empty state: «No featured work yet» muted text

### Шаг 3: Segment styling

**Что делать:**

- This segment likely on colored background (accent A) — use ColoredSegment + WaveDivider
- Text colors from --segment-accent-a-fg

## Граничные случаи

- 0 featured works — empty state, hide grid
- 1-2 works — grid still looks good
- Long titles — line-clamp 2
- Missing cover — placeholder image

## Критерии приёмки

- [ ] Shows only featured=true AND hidden=false works
- [ ] WorkCard links to correct /work/[slug]
- [ ] Categories displayed as pills
- [ ] View all work → /work
- [ ] Layout matches YNG 2-column reference
- [ ] id="featured-work" for nav
- [ ] Empty state handled
- [ ] Images lazy-loaded

## Дополнительные заметки

**Не делай:**

- Masonry on homepage — simple grid OK (masonry on /work page Task 15)
- No sort order — DB default order (createdAt desc)

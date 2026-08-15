# Task 15: Work Gallery (/work)

## Описание

Страница полной галереи работ: hero-заголовок, фильтр по категориям (pills), поиск по названию и категории, masonry-layout карточек, Contact-секция внизу. URL: `/work`.

## Предусловия

**Зависимости:**

- Task 03 — works.listAll, categories.list
- Task 05 — UI
- Task 13 — ContactSection

## Компоненты для ориентира

**work.png**

- Page label «— WORK»
- Title «Renders, films & case studies»
- Filter pills: All, Stills, Animation, Electronics... (dynamic from categories)
- Masonry/grid of WorkCards
- Full Contact/footer at bottom

## План выполнения

### Шаг 1: Page header

**Файл:** `src/app/work/page.tsx`

**Что делать:**

- Server component shell
- PageHero: overline, title, description (static English copy about 3D work)

### Шаг 2: WorkGallery client component

**Файл:** `src/components/work/WorkGallery.tsx`

**Features:**

- Fetch all public works + categories
- Category filter pills — «All» + each category
- Search input — filters by title OR category name (client-side)
- Masonry via `react-masonry-css`:
  - breakpointCols: { default: 3, 1024: 2, 640: 1 }
- Reuse WorkCard from Task 11

### Шаг 3: Filter logic

**Что делать:**

- State: selectedCategoryId | 'all', searchQuery string
- Filter: work.title includes query (case insensitive) OR any category.name includes query
- Combined filters AND logic
- Empty results: «No work found»

### Шаг 4: Performance

**Что делать:**

- lazy loading via **MediaImage** (GIF animation preserved)
- ~30 works max — client filter sufficient

### Шаг 5: Page assembly

**Что делать:**

- ContactSection at bottom (full, not footer)
- Header shows Work as active

## Граничные случаи

- No categories — only All pill
- No works — empty state
- Special characters in search

## Критерии приёмки

- [ ] /work lists all hidden=false works
- [ ] Masonry layout responsive
- [ ] Category filter works
- [ ] Search by title and category name
- [ ] WorkCard links to /work/[slug]
- [ ] ContactSection at bottom
- [ ] Matches work.png structure
- [ ] Client-side filtering performant

## Дополнительные заметки

**Не делай:**

- Server-side search — not needed for 30 items
- Sort controls — not in requirements

# Task 17: About-страница (/about)

## Описание

Страница About: основная статья (blog post с isMain=true) в полном MDX-формате, ниже — сетка карточек остальных статей (hidden=false). Contact-секция внизу. URL: `/about`.

## Предусловия

**Зависимости:**

- Task 03 — blog.getMain, blog.listPublic
- Task 05 — UI, **MDXContent**
- Task 13 — ContactSection

## Компоненты для ориентира

**about.png (YNG About)**

- Large hero headline for main story
- Multi-section article with numbered labels (01 THE STORY, 02 PHILOSOPHY)
- Portrait image in story section
- Client logos grid (optional — not in resurexi concept unless in MDX content)
- resurexi: main content comes from MDX blog post, flexible structure

## План выполнения

### Шаг 1: Page structure

**Файл:** `src/app/about/page.tsx`

**Sections:**

1. Page header — title from main post or static «About resurexi»
2. Main article — full MDX render of isMain post
3. «More articles» or «From the blog» — grid of other public posts
4. ContactSection

### Шаг 2: Main article render

**Что делать:**

- Fetch blog.getMain
- If no main post — placeholder «About content coming soon»
- MDX render with prose-lg styling
- Cover image if set

### Шаг 3: BlogPostCard

**Файл:** `src/components/blog/BlogPostCard.tsx`

**Props:** slug, title, subtitle, coverImageUrl

**What:**

- Card with image, title, subtitle
- Link to /blog/[slug]
- Grid 2-3 columns

### Шаг 4: Other posts list

**Что делать:**

- blog.listPublic excluding isMain post
- hidden=false only
- Empty: hide section

### Шаг 5: Metadata

**Что делать:**

- Page title «About — resurexi»
- Description, OG from isMain post SEO fields (fallback: post title/subtitle)
- **Canonical `/about` = `/about`** (hub-страница; не указывает на `/blog/[slug]`)
- Optional link «Read full story» → `/blog/[slug]` для main-статьи

## Граничные случаи

- No isMain post — graceful empty main area
- **isMain + hidden=true:** статья **не показывается** на /about; доступна только по прямой ссылке /blog/[slug]. Admin при установке isMain=true рекомендует снять hidden (warn в UI)
- blog.getMain фильтрует hidden=false (Task 03)

## Критерии приёмки

- [ ] Main isMain article rendered as MDX
- [ ] Other articles as cards linking to /blog/[slug]
- [ ] ContactSection at bottom
- [ ] Empty states handled
- [ ] Responsive layout
- [ ] Header About link active
- [ ] Page metadata set

## Дополнительные заметки

**Не делай:**

- Hardcode story sections — content lives in MDX
- Client logos grid unless part of MDX

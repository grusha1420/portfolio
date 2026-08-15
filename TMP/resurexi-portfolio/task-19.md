# Task 19: SEO-инфраструктура

## Описание

Настроить SEO для всего сайта: generateMetadata на страницах работ и статей (title, description, OG-image), базовые meta для статических страниц, динамический sitemap.xml, robots.txt. Поля SEO из БД (metaTitle, metaDescription, ogImageUrl) с fallback на title/description/cover.

## Предусловия

**Зависимости:**

- Task 16 — work page
- Task 17 — about page
- Task 18 — blog page

## План выполнения

### Шаг 1: Metadata helper

**Файл:** `src/lib/seo.ts`

**Functions:**

```typescript
buildMetadata({ title, description, ogImage, path }) → Metadata
getWorkMetadata(work) → Metadata
getBlogMetadata(post) → Metadata
```

**Fallbacks:**

- metaTitle ?? title
- metaDescription ?? subtitle ?? truncated content
- ogImageUrl ?? coverImageUrl ?? default site OG in public/

### Шаг 2: Work & blog generateMetadata

**Файлы:**

- `src/app/work/[slug]/page.tsx`
- `src/app/blog/[slug]/page.tsx`

**Что делать:**

- export async function generateMetadata({ params })
- OpenGraph + Twitter card tags
- Canonical URL (needs site URL env — NEXT_PUBLIC_SITE_URL placeholder)

### Шаг 3: noindex для скрытого контента

**Что делать:**

- В `generateMetadata` для `/work/[slug]` и `/blog/[slug]`: если `hidden=true` → `robots: { index: false, follow: false }`
- Предотвращает индексацию черновиков при утечке URL (не в sitemap, но noindex обязателен)

### Шаг 3: Pages metadata

**Файлы:** `page.tsx`, `work/page.tsx`, **`about/page.tsx`**, `layout.tsx`

**`/about` (dynamic):**

- `generateMetadata` — fetch `blog.getMain`, apply metaTitle/metaDescription/ogImage from isMain post (Task 17)
- Fallback static defaults if no main post
- Canonical: `/about`

**Остальные static pages:**

- Site name: resurexi
- Default description: 3D model designer portfolio

### Шаг 4: sitemap.xml

**Файл:** `src/app/sitemap.ts` (Next.js MetadataRoute)

**URLs:**

- /, /work, /about
- All /work/[slug] where hidden=false
- All /blog/[slug] where hidden=false
- lastModified from updatedAt
- Exclude /admin/*

### Шаг 5: robots.txt

**Файл:** `src/app/robots.ts`

**Rules:**

- Allow: /
- Disallow: /admin
- Sitemap: {SITE_URL}/sitemap.xml

### Шаг 6: Default OG image

**Что делать:**

- Placeholder `public/og-default.png` 1200x630
- Used when no ogImageUrl

## Граничные случаи

- SITE_URL not set — use VERCEL_URL in production or localhost dev
- hidden content excluded from sitemap but still accessible by URL
- **isMain article:** в sitemap **`/about`** (hub) **и** `/blog/[slug]` (permalink); каждый URL со своим canonical
- **Canonical policy:** `/about` → `/about`; `/blog/[slug]` → `/blog/[slug]` (без cross-canonical)

## Критерии приёмки

- [ ] Work pages have dynamic OG tags
- [ ] Blog pages have dynamic OG tags
- [ ] sitemap.xml includes public works and posts
- [ ] robots.txt disallows /admin
- [ ] SEO field fallbacks work
- [ ] Default OG image exists
- [ ] hidden=true pages have robots noindex

## Дополнительные заметки

**Не делай:**

- JSON-LD structured data — optional, not in concept
- Analytics — not needed

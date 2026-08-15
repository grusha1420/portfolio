# Task 18: Страница статьи (/blog/[slug])

## Описание

Страница отдельной статьи блога: заголовок, подзаголовок, cover, MDX-контент, SEO metadata. Доступна по прямой ссылке даже если hidden=true. Contact-секция внизу.

## Предусловия

**Зависимости:**

- Task 03 — blog.getBySlug
- Task 05 — UI, **MDXContent**
- Task 13 — ContactSection

## План выполнения

### Шаг 1: Dynamic route

**Файл:** `src/app/blog/[slug]/page.tsx`

**Что делать:**

- Server fetch blog.getBySlug
- notFound() if missing
- generateMetadata

### Шаг 2: Article layout

**Структура:**

- Article header: title, subtitle, optional date (createdAt formatted)
- Cover image full-width or contained
- MDX body via **MDXContent** (Task 05) — не создавать компонент здесь

### Шаг 3: Hidden articles

**Что делать:**

- Accessible by direct URL when hidden=true
- Not listed on /about when hidden

### Шаг 4: Contact at bottom

**Что делать:**

- Full ContactSection

## Граничные случаи

- MDX with uploaded images — URLs from Uploadthing in content
- Very long articles — prose scroll
- Missing cover — skip image block

## Критерии приёмки

- [ ] /blog/[slug] renders article MDX
- [ ] hidden articles accessible by URL
- [ ] 404 invalid slug
- [ ] Shared MDXContent from Task 05 (no duplicate component)
- [ ] ContactSection at bottom
- [ ] generateMetadata with SEO fields
- [ ] Responsive typography

## Дополнительные заметки

**Не делай:**

- Comments, share buttons
- Table of contents (unless in MDX manually)

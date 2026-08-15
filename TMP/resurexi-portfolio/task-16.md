# Task 16: Страница работы (/work/[slug])

## Описание

Детальная страница работы: заголовок, подзаголовок, категории, галерея изображений, embedded YouTube-видео, MDX-описание, SEO metadata. Доступна по прямой ссылке даже если hidden=true. Contact-секция внизу.

## Предусловия

**Зависимости:**

- Task 03 — works.getBySlug
- Task 05 — UI, **MDXContent**, MediaImage
- Task 13 — ContactSection

## План выполнения

### Шаг 1: Dynamic route

**Файл:** `src/app/work/[slug]/page.tsx`

**Что делать:**

- Fetch work by slug server-side
- notFound() if slug doesn't exist
- generateMetadata for SEO (Task 19 may extend — basic here)

### Шаг 2: Work header

**Что делать:**

- Title, subtitle
- Category badges
- Cover via **MediaImage** (GIF animation preserved)

### Шаг 3: Image gallery

**Файл:** `src/components/work/WorkImageGallery.tsx`

**Что делать:**

- Grid or carousel of gallery images sorted by order
- Use **MediaImage** for each item (GIF support)
- Lightbox optional enhancement — simple large grid OK for v1

### Шаг 4: YouTube embeds

**Файл:** `src/components/work/YouTubeEmbed.tsx`

**Что делать:**

- Parse video ID from URL (youtube.com/watch?v=, youtu.be/)
- Responsive 16:9 iframe embed
- Multiple videos stacked sorted by order

### Шаг 5: MDX content

**Что делать:**

- Использовать **MDXContent** из `src/components/mdx/MDXContent.tsx` (Task 05)
- Передать work.description как MDX string
- **Не создавать** отдельный WorkDescription.tsx — только thin wrapper если нужен spacing

### Шаг 6: Hidden works

**Что делать:**

- Page accessible regardless of hidden flag
- Optional «Draft» banner if hidden=true (admin visual cue — subtle, optional)

### Шаг 7: Contact at bottom

**Что делать:**

- Full ContactSection

## Граничные случаи

- Invalid YouTube URL — skip or show error placeholder
- Empty gallery — show cover only
- Empty description — hide prose block
- MDX parse error — show raw or error message

## Критерии приёмки

- [ ] /work/[slug] renders all work data
- [ ] Gallery images in order
- [ ] YouTube videos embed correctly
- [ ] MDX via shared MDXContent component
- [ ] hidden works accessible by direct URL
- [ ] 404 for invalid slug
- [ ] ContactSection at bottom
- [ ] generateMetadata with title, description, ogImage

## Дополнительные заметки

**Не делай:**

- Prev/next navigation — not required
- Share buttons — not required
- Related works — not required

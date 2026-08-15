# Task 02: Схема базы данных Drizzle

## Описание

Определить полную схему PostgreSQL через Drizzle ORM для всех сущностей портфолио: работы, категории, статьи блога, контактные ссылки, заявки из формы, контент сегментов главной. Настроить relations, применить миграцию/push к локальной или Neon БД.

## Предусловия

**Зависимости:**

- Task 01 — T3-проект с Drizzle настроен

**Необходимые файлы:**

- `drizzle.config.ts`
- `src/server/db/schema.ts` (или аналог в T3)

## TypeScript типы

### Таблицы для создания

```typescript
// categories
{ id, name, slug, createdAt }

// works
{ id, slug, title, subtitle, description (text/MDX), coverImageUrl,
  coverIsAnimated (boolean, default false),
  featured (boolean, default false), hidden (boolean, default true),
  metaTitle, metaDescription, ogImageUrl,
  createdAt, updatedAt }

// work_categories (many-to-many)
{ workId, categoryId }

// work_gallery_images
{ id, workId, url, alt, order (integer), isAnimated (boolean, default false) }

// work_youtube_videos
{ id, workId, url, order (integer) }

// blog_posts
{ id, slug, title, subtitle, coverImageUrl, content (text/MDX),
  isMain (boolean, default false), hidden (boolean, default true),
  metaTitle, metaDescription, ogImageUrl,
  createdAt, updatedAt }

// contact_links
{ id, label, url, iconUrl (nullable), order (integer), createdAt }

// contact_requests
{ id, name, company (nullable), email, phone (nullable), message,
  isRead (boolean, default false), createdAt }

// site_content (singleton rows by key)
{ id, key ('hero' | 'about_preview' | 'contact_info'),
  heroTitle, heroSubtitle, heroGifUrl,
  heroWireframeUrl, heroWireframeColorUrl,
  aboutPreviewTitle, aboutPreviewText, aboutPreviewImageUrl,
  contactEmail, responseTimeText, basedInText,
  updatedAt }
```

## План выполнения

### Шаг 1: Таблица categories

**Что делать:**

- Поля: id (uuid/cuid), name (varchar), slug (unique), createdAt
- Индекс на slug

### Шаг 2: Таблица works и связанные

**Что делать:**

- works — основные поля, defaults: featured=false, hidden=true
- work_categories — junction table с composite PK или id
- work_gallery_images — FK на works, cascade delete, поле order для сортировки
- work_youtube_videos — FK на works, поле order

**Relations в Drizzle:**

- works ↔ categories (many-to-many)
- works → galleryImages (one-to-many)
- works → youtubeVideos (one-to-many)

### Шаг 3: Таблица blog_posts

**Что делать:**

- isMain default false, hidden default true
- Уникальный slug
- Логика «одна isMain» — enforced на уровне tRPC (Task 24), не DB constraint

### Шаг 4: contact_links и contact_requests

**Что делать:**

- contact_links — order для drag-free ручной сортировки (number input в админке)
- contact_requests — все поля формы из уточнений

### Шаг 5: site_content

**Что делать:**

- key enum: 'hero' | 'about_preview' | **'contact_info'**
- Поля contact_info: contactEmail, responseTimeText, basedInText (nullable)
- Все поля nullable кроме key
- При первом запуске seed не обязателен — админка создаст записи; но можно добавить upsert в Task 25

### Шаг 6: Миграция

**Что делать:**

- `pnpm db:push` или generate migration + migrate
- Проверить подключение к DATABASE_URL

## Граничные случаи

- slug uniqueness — unique constraint на works.slug и blog_posts.slug и categories.slug
- Cascade delete gallery/videos при удалении work
- Пустая БД — публичные страницы должны показывать empty states (реализуется в UI-задачах)

## Критерии приёмки

- [ ] Все 8 сущностей (+ junction) определены в schema.ts
- [ ] Relations настроены корректно
- [ ] Defaults: hidden=true, featured=false, isMain=false, isRead=false
- [ ] Unique constraints на slug-полях
- [ ] `pnpm db:push` успешно применяет схему
- [ ] Drizzle Studio (`pnpm db:studio`) показывает все таблицы
- [ ] Нет ошибок TypeScript в schema

## Дополнительные заметки

**Рекомендации:**

- Использовать `createId()` из `@paralleldrive/cuid2` или uuid — как принято в T3
- description и content хранить как text — MDX строка

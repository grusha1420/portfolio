# Task 25: Админка — Content (Hero + About)

## Описание

Раздел Content в админке: Hero, About preview, **Contact Info** (email, response time, based in). Редактирование текстов и медиа сегментов главной.

## Предусловия

**Зависимости:**

- Task 09 — ImageUploader
- Task 20 — admin layout
- Task 03 — content admin procedures

## План выполнения

### Шаг 1: Content page with tabs

**Файл:** `src/app/admin/content/page.tsx`

**Tabs:**

- Hero
- About Preview
- **Contact Info**

### Шаг 2: Hero tab form

**Fields:**

- heroTitle (text)
- heroSubtitle (textarea)
- heroGifUrl — ImageUploader accepting GIF
- heroWireframeUrl — ImageUploader (B&W wireframe)
- heroWireframeColorUrl — ImageUploader (color version)
- Save button → content.updateHero

**Help text:**

- Explain wireframe dual-layer effect and matching dimensions

### Шаг 3: About Preview tab form

**Fields:**

- aboutPreviewTitle
- aboutPreviewText (textarea, medium length)
- aboutPreviewImageUrl — ImageUploader
- Save → content.updateAboutPreview

### Шаг 4: Contact Info tab

**Fields (site_content key='contact_info'):**

- contactEmail (text, e.g. info@example.com)
- responseTimeText (text)
- basedInText (text)
- Save → content.updateContactInfo

### Шаг 5: Initial seed

**Что делать:**

- On first load if no site_content rows — create empty defaults via upsert
- Migration or admin page mount effect

### Шаг 6: Preview link

**Что делать:**

- «View on site →» link to /#hero and /#about opens public page

## Граничные случаи

- Partial update — only send changed fields
- Large GIF — size limit message from Uploadthing

## Критерии приёмки

- [ ] Edit Hero all fields, saves to DB
- [ ] Edit About preview all fields
- [ ] GIF and wireframe uploads work
- [ ] Changes reflect on homepage after save
- [ ] Upsert creates records if missing
- [ ] Contact Info tab edits email, response time, based in

## Дополнительные заметки

**Не делай:**

- Live preview iframe — link to site sufficient

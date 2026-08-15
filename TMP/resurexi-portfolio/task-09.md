# Task 09: Uploadthing — загрузка медиа

## Описание

Настроить Uploadthing для загрузки изображений в админке: cover works, gallery images, blog covers, OG images, hero GIF/wireframe layers, contact link icons. File router с auth check. React-компонент ImageUploader для переиспользования в формах.

## Предусловия

**Зависимости:**

- Task 04 — admin auth (Uploadthing middleware checks session)

## План выполнения

### Шаг 1: Uploadthing setup

**Файлы:**

- `src/app/api/uploadthing/core.ts` — fileRouter
- `src/app/api/uploadthing/route.ts` — route handler
- `src/utils/uploadthing.ts` — generateReactHelpers

**Routes:**

- `imageUploader` — images only, max 4MB (adjust), max 20 files for gallery batch
- Middleware: verify admin session before upload

### Шаг 2: ImageUploader component

**Файл:** `src/components/admin/ImageUploader.tsx`

**Props:**

```typescript
{
  value: string | { url: string; isAnimated?: boolean } | array thereof;
  onChange: (value) => void;
  multiple?: boolean;
  label?: string;
  detectAnimated?: boolean; // default true — set isAnimated from uploaded file mime (image/gif)
}
```

**Что делать:**

- Dropzone UI with preview thumbnails
- On upload complete: detect `file.type === 'image/gif'` → set **isAnimated: true**
- Return `{ url, isAnimated }` to parent form (works cover, gallery items)
- Delete button removes from value (does not delete from Uploadthing CDN — acceptable for v1)
- Loading state during upload
- Error toast on failure

### Шаг 3: GIF support for Hero

**Что делать:**

- Allow image/gif in fileRouter
- Optional: separate endpoint with higher size limit for hero GIF

### Шаг 4: Env validation

**Что делать:**

- UPLOADTHING_SECRET, UPLOADTHING_APP_ID in env schema (@t3-oss/env-nextjs)

## Граничные случаи

- Upload without auth → 401
- Large GIF — show file size error
- Network failure — retry button

## Критерии приёмки

- [ ] Uploadthing route works with admin auth
- [ ] ImageUploader single and multiple modes
- [ ] Preview and delete in UI
- [ ] GIF upload works for Hero
- [ ] Env vars validated
- [ ] Used in at least one test admin form (can be wired fully in Tasks 23-26)

## Дополнительные заметки

**Не делай:**

- Video upload — only YouTube URLs for works
- Don't build full admin forms here — just upload infrastructure

# Task 23: Админка — Work CRUD

## Описание

Полный CRUD работ в админке: список, форма с **mdxEditor** для description (тот же компонент MdxEditor что Task 24), cover/gallery upload, YouTube URLs, categories, featured/hidden, SEO.

## Предусловия

**Зависимости:**

- Task 09 — ImageUploader
- Task 20 — admin layout
- Task 22 — categories exist
- **Task 24** — shared MdxEditor component (Task 24 создаёт редактор, Task 23 использует)

## План выполнения

### Шаг 1: Work list

**Файл:** `src/app/admin/work/page.tsx`

**UI:**

- Table: Cover thumb, Title, Featured ✓, Hidden ✓, Categories, Actions (Edit, Delete)
- Header link: **Manage Categories →** `/admin/work/categories`
- «New Work» button → /admin/work/new
- Filter: all / hidden / published optional

### Шаг 2: Work form (create/edit)

**Файл:** `src/app/admin/work/[id]/page.tsx` or `/new`

**Sections:**

1. **Basic:** title*, subtitle, slug* (auto)
2. **Media:** cover ImageUploader (single, saves **coverIsAnimated** from upload mime), gallery ImageUploader (multiple with drag reorder, **isAnimated** per item)
3. **Videos:** dynamic list of YouTube URL inputs + add/remove, order
4. **Categories:** multi-select checkboxes from categories.list
5. **Description:** **MdxEditor** (shared component from Task 24 — создать в Task 24, импортировать здесь; WYSIWYG MDX как для блога)
6. **Flags:** featured checkbox, hidden checkbox (default true on create)
7. **SEO:** metaTitle, metaDescription, ogImage upload

### Шаг 3: Gallery reorder

**Что делать:**

- Drag-and-drop order (dnd-kit) OR up/down arrows
- Persist order field on save

### Шаг 4: tRPC mutations

**Procedures:**

- works.create — with nested gallery/videos
- works.update
- works.delete — cascade gallery/videos
- works.getById — admin, includes hidden

### Шаг 5: Validation

**Что делать:**

- Required: title, slug, cover
- YouTube URL format validation
- At least warn if publishing (hidden=false) without cover

## Граничные случаи

- Delete work — confirm dialog
- Upload in progress — block save
- Many gallery images — scroll list

## Критерии приёмки

- [ ] Create new work with all fields
- [ ] Edit existing work
- [ ] Delete work
- [ ] Cover and gallery upload via Uploadthing
- [ ] YouTube URLs saved and ordered
- [ ] Categories assignable
- [ ] featured and hidden toggles work
- [ ] SEO fields saved
- [ ] hidden defaults true on create
- [ ] Slug uniqueness enforced
- [ ] Gallery reorder works

## Дополнительные заметки

**Recommendation:** Reuse **MdxEditor** component — один редактор для Work и Blog (решение Pass 1 review).

**Не делай:**

- Video file upload — YouTube only

# Task 24: Админка — Blog CRUD + mdxEditor

## Описание

CRUD статей блога с mdxEditor. **Создаёт shared компонент `MdxEditor`** — переиспользуется в Task 23 (Work CRUD).

## Предусловия

**Зависимости:**

- Task 09 — Uploadthing
- Task 20 — admin layout

## План выполнения

### Шаг 1: Blog list

**Файл:** `src/app/admin/blog/page.tsx`

**UI:**

- Table: Title, isMain ✓, Hidden ✓, Updated, Actions
- «New Post» button

### Шаг 2: Blog editor page

**Файл:** `src/app/admin/blog/[id]/page.tsx` and `/new`

**Form fields:**

- title*, subtitle, slug*
- cover ImageUploader
- **content:** mdxEditor full WYSIWYG
- isMain checkbox — when checked, uncheck others in DB (transaction)
- hidden checkbox (default true)
- SEO: metaTitle, metaDescription, ogImage

### Шаг 3: mdxEditor integration

**Файл:** `src/components/admin/MdxEditor.tsx`

**Что делать:**

- Client component only (dynamic import ssr: false)
- Configure plugins: headings, lists, links, images, bold, italic, etc.
- Image upload handler → Uploadthing
- Store output as MDX/markdown string
- **Shared export** — импортировать в Task 23 Work form
- Match saved format with MDXContent renderer on public pages

### Шаг 4: isMain logic

**Что делать:**

- On set isMain=true: UPDATE all other posts SET isMain=false
- Only one main post at a time
- Warn if setting hidden=true on isMain post

### Шаг 5: tRPC

**Procedures:**

- blog.create, update, delete, getById (admin)
- blog.setMain — optional dedicated mutation

## Граничные случаи

- mdxEditor SSR — must use dynamic import
- Large content — editor performance
- Delete isMain post — allow, /about shows empty state

## Критерии приёмки

- [ ] mdxEditor works in create/edit forms
- [ ] WYSIWYG editing without separate preview
- [ ] Image upload inside editor via Uploadthing
- [ ] isMain exclusivity enforced
- [ ] hidden defaults true on create
- [ ] SEO fields saved
- [ ] CRUD complete
- [ ] MdxEditor exported for reuse in Work admin (Task 23)

## Дополнительные заметки

**Важно:**

- mdxEditor обязателен с первой версии (уточнения)
- Test roundtrip: edit in admin → view on public page

**Не делай:**

- Separate preview pane — editor IS the preview

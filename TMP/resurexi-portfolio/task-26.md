# Task 26: Админка — Contact links

## Описание

CRUD контактных ссылок для Contact-секции: label, URL, icon (URL or upload), порядок отображения. WhatsApp, Telegram, social media — все управляются здесь.

## Предусловия

**Зависимости:**

- Task 09 — ImageUploader for icons
- Task 20 — admin layout
- Task 03 — contact links CRUD

## План выполнения

### Шаг 1: Contact links page

**Файл:** `src/app/admin/contact/page.tsx`

**UI:**

- Sortable list of links (drag reorder OR numeric order input)
- Each row: icon preview, label, url, edit/delete
- Add Link button

### Шаг 2: Link form (modal)

**Fields:**

- label* (e.g. «Telegram», «WhatsApp», «Behance»)
- url* (full URL including https://)
- iconUrl — optional ImageUploader OR external icon URL input
- order — auto from position in list

### Шаг 3: Icon handling

**Что делать:**

- Preview icon in list
- Fallback note: if empty, Lucide Link used on public site

### Шаг 4: tRPC

**Procedures:**

- contact.createLink, updateLink, deleteLink, reorderLinks

### Шаг 5: Common presets (optional UX)

**Что делать:**

- Quick-add templates for WhatsApp/Telegram URL patterns — optional helper, not required

## Граничные случаи

- Invalid URL — Zod url validation
- Empty list — public Contact hides social grid
- Duplicate order — normalize on save

## Критерии приёмки

- [ ] Create, edit, delete links
- [ ] Reorder links reflected on public site
- [ ] Icon upload or URL works
- [ ] Changes appear in ContactSection
- [ ] WhatsApp/Telegram manageable here (also show in Hero contact icons)

## Дополнительные заметки

**Не делай:**

- Contact form fields — static (не редактируются в admin)
- Contact Info panel (email, response time, based in) — редактируется в **Content admin** (Task 25), не здесь

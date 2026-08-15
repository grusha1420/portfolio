# Task 22: Админка — Categories

## Описание

CRUD категорий работ в админке: создание, редактирование названия и slug, удаление (если не используется). Категории используются в Work forms и фильтрах /work. URL: **`/admin/work/categories`** (sub-nav из Work admin, Task 20).

## Предусловия

**Зависимости:**

- Task 03 — categories router
- Task 20 — admin layout (Work | Categories sub-nav)

## План выполнения

### Шаг 1: Categories page

**Файл:** `src/app/admin/work/categories/page.tsx`

**URL:** `/admin/work/categories`

**Что делать:**

- Доступ через sub-nav «Categories» в header Work admin (Task 20)
- Ссылка «Manage Categories →» на `/admin/work` list (Task 23)

### Шаг 2: Category list

**UI:**

- Table: Name, Slug, Work count (optional), Actions
- Add Category button

### Шаг 3: Create/Edit form

**Modal or inline form:**

- Name (required)
- Slug (auto from name, editable)
- Save / Cancel

### Шаг 4: Delete

**Что делать:**

- Prevent delete if category assigned to works OR cascade unlink
- Confirm dialog

### Шаг 5: tRPC

**Procedures:**

- categories.create, update, delete, list (admin)

## Граничные случаи

- Duplicate slug — validation error
- Delete category in use — block with message

## Критерии приёмки

- [ ] Page at `/admin/work/categories` (NOT `/admin/categories`)
- [ ] Create category with name and slug
- [ ] Edit existing category
- [ ] Delete unused category
- [ ] Slug auto-generation
- [ ] List all categories
- [ ] Duplicate slug prevented
- [ ] Linked from Work admin sub-nav

## Дополнительные заметки

**Note:** Categories — sub-section Work admin, не отдельный пункт sidebar

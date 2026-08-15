# Task 03: Базовая инфраструктура tRPC и утилиты

## Описание

Настроить tRPC routers для всех публичных и admin API: works, blog, contact, site content, categories, requests. Создать shared Zod-схемы валидации, утилиты slug, error handling. Разделить public и protected procedures.

## Предусловия

**Зависимости:**

- Task 02 — схема БД готова

## Компоненты для ориентира

**T3 defaults** (`src/server/api/routers/`)

- Следуй паттерну example router из create-t3-app
- publicProcedure vs protectedProcedure (admin)

## TypeScript типы

### Router structure

```
appRouter
├── works       (public: list, getBySlug; admin: CRUD)
├── categories  (public: list; admin: CRUD)
├── blog        (public: list, getBySlug, getMain; admin: CRUD)
├── contact     (public: getLinks, submitRequest; admin: links CRUD, requests)
├── content     (public: getHero, getAboutPreview; admin: update)
└── admin       (login, logout, session check)
```

## План выполнения

### Шаг 1: Admin context и protectedProcedure

**Что делать:**

- Middleware проверки admin session (cookie/token после Task 04)
- protectedProcedure оборачивает все admin mutations/queries
- Пока Task 04 не готов — заглушка или параллельная работа

### Шаг 2: Works router (public)

**Что делать:**

- `works.listPublic` — hidden=false, optional featured filter
- `works.listFeatured` — featured=true AND hidden=false
- `works.getBySlug` — по slug, включая categories, gallery, videos; **hidden работы доступны по прямой ссылке** (не фильтровать hidden при getBySlug)
- `works.listAll` для /work — hidden=false

### Шаг 3: Blog router (public)

**Что делать:**

- `blog.getMain` — isMain=true **AND hidden=false** (на /about только опубликованная main-статья)
- `blog.listPublic` — hidden=false, exclude isMain post — для /about список «других» статей
- `blog.getBySlug` — hidden статьи доступны по прямой ссылке (getBySlug не фильтрует hidden)

### Шаг 4: Contact router

**Что делать:**

- `contact.getLinks` — sorted by order
- `contact.submitRequest` — mutation, Zod: name (required), email (required, email), company, phone, message (required)
- Admin: listRequests, markRequestRead, **getUnreadCount** (count where isRead=false), CRUD links, **reorderLinks** (batch update order)

### Шаг 5: Content router

**Что делать:**

- `content.getHero` — site_content where key='hero'
- `content.getAboutPreview` — key='about_preview'
- Admin: updateHero, updateAboutPreview, **updateContactInfo**
- Public: **getContactInfo** — contactEmail, responseTimeText, basedInText (из site_content key='contact_info')

### Шаг 6: Categories router

**Что делать:**

- Public list для фильтров на /work
- Admin CRUD

### Шаг 7: Утилиты

**Файлы:**

- `src/lib/slug.ts` — slugify с транслитерацией, проверка uniqueness
- `src/lib/cn.ts` — clsx + tailwind-merge (если не из shadcn)

## Граничные случаи

**Обработка ошибок:**

- NOT_FOUND при несуществующем slug
- CONFLICT при duplicate slug
- UNAUTHORIZED на protected без сессии

**Валидация:**

- YouTube URL — базовая проверка формата (youtube.com / youtu.be)
- Email в форме — z.string().email()

## Критерии приёмки

- [ ] appRouter объединяет все sub-routers
- [ ] Public endpoints возвращают корректные данные с relations
- [ ] hidden=false фильтр на list, но не на getBySlug
- [ ] Zod-схемы для всех inputs
- [ ] Slug utility с uniqueness check
- [ ] TypeScript inference работает на клиенте через api.xxx.useQuery

## Дополнительные заметки

**Не делай:**

- Не реализуй UI — только API layer
- Auth login/logout — Task 04, но router admin.login можно подготовить

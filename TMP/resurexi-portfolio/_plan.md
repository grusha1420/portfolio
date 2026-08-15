# Портфолио resurexi — полный план разработки

## Краткое описание

Создание с нуля портфолио-сайта 3D-дизайнера Анастасии Майданниковой (resurexi) на T3 Stack. Сайт включает одностраничную главную с четырьмя сегментами (Hero, Featured Work, About, Contact), дополнительные страницы галереи работ и блога, а также защищённую админку для управления контентом. Референсы дизайна: kenney.nl (волны между сегментами), yunusgezginci.com (структура и Cal.com popup), polygoniq.com (wireframe-эффект в Hero).

Проект **не MVP** — реализуется весь scope из концепта и уточнений без отложенных фич.

## Контекст

**Источники требований:**

- `план портфолио/концепт.md` — функциональный концепт
- `план портфолио/уточнения.md` — зафиксированные решения по дизайну, UX, технике
- Скриншоты-референсы в `план портфолио/*.png`

**Стек:**

- Next.js (App Router), Tailwind CSS, tRPC, Drizzle ORM, Postgres (Neon)
- Uploadthing — изображения
- mdxEditor — WYSIWYG для MDX-статей
- @calcom/embed-react — букинг звонков
- next-themes — светлая/тёмная тема
- Vercel — хостинг

**URL-структура:**

| Страница | URL |
|----------|-----|
| Главная | `/` |
| Work Gallery | `/work` |
| Работа | `/work/[slug]` |
| About | `/about` |
| Статья | `/blog/[slug]` |
| Админка | `/admin` |

## Архитектура данных (обзор)

```
categories ──┐
             ├── works (featured, hidden, cover, gallery, youtube videos, MDX, SEO)
             │
blog_posts (isMain, hidden, MDX, SEO)
             │
contact_links (text, url, icon)
             │
contact_requests (form submissions, read status)
             │
site_content (hero/about segment content — singleton records)
```

## Список задач

### Task 01: Инициализация T3-проекта

**Файлы:** `task-01.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Создание проекта через create-t3-app с нужными опциями, базовая структура, env-шаблон.

### Task 02: Схема базы данных Drizzle

**Файлы:** `task-02.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Все таблицы, relations, enums, seed не нужен.  
**Зависимости:** Task 01

### Task 03: Базовая инфраструктура tRPC и утилиты

**Файлы:** `task-03.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Root router, error handling, Zod-схемы, shared types, slug-генерация.  
**Зависимости:** Task 02

### Task 04: Авторизация админки

**Файлы:** `task-04.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Password auth через env, middleware защиты /admin, session cookie.  
**Зависимости:** Task 03

### Task 05: Дизайн-система и темизация

**Файлы:** `task-05.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** CSS-переменные, next-themes, UI-примитивы, **MDXContent** (shared), **MediaImage** (GIF).  
**Зависимости:** Task 01

### Task 06: Компонент волнового разделителя (WaveDivider)

**Файлы:** `task-06.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** SVG/CSS-анимация как у kenney.nl — без упрощений, top/bottom варианты.  
**Зависимости:** Task 05

### Task 07: Header и навигация

**Файлы:** `task-07.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Фиксированный хедер, smooth scroll к сегментам, ссылки на /work и /about, переключатель темы.  
**Зависимости:** Task 05, Task 08

### Task 08: Cal.com popup-модал

**Файлы:** `task-08.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Переиспользуемый модал с embed, backdrop, кнопка закрытия — как YNG.CGI.  
**Зависимости:** Task 05

### Task 09: Uploadthing — загрузка медиа

**Файлы:** `task-09.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** File router, React-компонент загрузки для админки, удаление файлов.  
**Зависимости:** Task 04

### Task 10: Hero-секция

**Файлы:** `task-10.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** GIF-фон, wireframe dual-layer с эффектом курсора/скролла, контакты, CTA Cal.com.  
**Зависимости:** Task 05, Task 06, Task 08

### Task 11: Featured Work-секция

**Файлы:** `task-11.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Карточки featured-работ, категории, ссылка на /work.  
**Зависимости:** Task 03, Task 05, **Task 06**

### Task 12: About-секция (превью на главной)

**Файлы:** `task-12.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Краткий текст из site_content, default bg, кнопка на /about.  
**Зависимости:** Task 03, Task 05

### Task 13: Contact-секция и форма

**Файлы:** `task-13.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Форма, Contact Info из CMS, соцссылки; на главной — accent B + waves (`variant='home'`).  
**Зависимости:** Task 03, Task 05, Task 06, Task 08

### Task 14: Сборка главной страницы

**Файлы:** `task-14.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Компоновка всех сегментов с чередующимися фонами и волнами.  
**Зависимости:** Task 07, Task 10, Task 11, Task 12, Task 13

### Task 15: Work Gallery (/work)

**Файлы:** `task-15.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Masonry-галерея, фильтр по категориям, поиск по названию/категории, Contact внизу.  
**Зависимости:** Task 03, Task 05 (MDXContent, MediaImage), Task 13

### Task 16: Страница работы (/work/[slug])

**Файлы:** `task-16.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Галерея изображений, YouTube embeds, MDX-описание, SEO metadata, Contact внизу.  
**Зависимости:** Task 03, Task 05 (MDXContent, MediaImage), Task 13

### Task 17: About-страница (/about)

**Файлы:** `task-17.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Основная статья (isMain), список остальных статей карточками, Contact внизу.  
**Зависимости:** Task 03, Task 05 (MDXContent, MediaImage), Task 13

### Task 18: Страница статьи (/blog/[slug])

**Файлы:** `task-18.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Рендер MDX, SEO metadata, Contact внизу.  
**Зависимости:** Task 03, Task 05 (MDXContent, MediaImage), Task 13

### Task 19: SEO-инфраструктура

**Файлы:** `task-19.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** generateMetadata для работ/статей, sitemap.xml, robots.txt, OG-images.  
**Зависимости:** Task 16, Task 17, Task 18

### Task 20: Админка — layout и sidebar

**Файлы:** `task-20.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Общий layout /admin с боковым меню, badge непрочитанных requests.  
**Зависимости:** Task 04, Task 05

### Task 21: Админка — Requests

**Файлы:** `task-21.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Список заявок из формы, просмотр, отметка прочитанным.  
**Зависимости:** Task 03, Task 20

### Task 22: Админка — Categories

**Файлы:** `task-22.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** CRUD категорий работ (название, slug).  
**Зависимости:** Task 03, Task 20

### Task 23: Админка — Work CRUD

**Файлы:** `task-23.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Создание/редактирование работ: cover, gallery, YouTube, MDX, featured, hidden, SEO, категории.  
**Зависимости:** Task 09, Task 20, Task 22, **Task 24** (shared MdxEditor)

### Task 24: Админка — Blog CRUD + mdxEditor

**Файлы:** `task-24.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Статьи с mdxEditor (WYSIWYG), isMain, hidden, SEO, загрузка изображений.  
**Зависимости:** Task 09, Task 20

### Task 25: Админка — Content (Hero + About)

**Файлы:** `task-25.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Редактирование текстов и медиа сегментов Hero и About на главной.  
**Зависимости:** Task 09, Task 20

### Task 26: Админка — Contact links

**Файлы:** `task-26.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** CRUD ссылок (текст, URL, иконка), порядок сортировки.  
**Зависимости:** Task 09, Task 20

### Task 27: Деплой и production-конфигурация

**Файлы:** `task-27.md`  
**Тип:** ДОБАВЛЕНИЕ  
**Описание:** Vercel, Neon, env vars, db push, README с инструкциями.  
**Зависимости:** Task 19, Task 21–26

## Порядок выполнения

```
Фаза 1 — Фундамент:
  Task 01 → Task 02 → Task 03 → Task 04
  Task 01 → Task 05 (параллельно с 02–04)

Фаза 2 — UI-компоненты:
  Task 05 → Task 06, Task 07, Task 08
  Task 04 → Task 09

Фаза 3 — Публичный сайт:
  Task 10, 11, 12, 13 (параллельно после зависимостей)
  Task 14 (сборка главной)
  Task 15, 16, 17, 18 (страницы)
  Task 19 (SEO)

Фаза 4 — Админка:
  Task 20 → Task 21, 22 (параллельно)
  Task 24 (MdxEditor shared) → Task 23 (Work CRUD uses MdxEditor)
  Task 25, 26 (параллельно после 09, 20)

Фаза 5 — Деплой:
  Task 27
```

## Ключевые TypeScript типы

```typescript
// Категория работы
interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

// Работа
interface Work {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string; // MDX
  coverImageUrl: string;
  coverIsAnimated: boolean;
  galleryImages: GalleryImage[];
  youtubeVideos: YoutubeVideo[];
  featured: boolean;
  hidden: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isAnimated: boolean;
}

interface YoutubeVideo {
  id: string;
  url: string;
  order: number;
}

// Статья блога
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  content: string; // MDX
  isMain: boolean;
  hidden: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Контактная ссылка
interface ContactLink {
  id: string;
  label: string;
  url: string;
  iconUrl: string | null;
  order: number;
}

// Заявка из формы
interface ContactRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Контент сегментов главной
interface SiteContent {
  id: string;
  key: "hero" | "about_preview" | "contact_info";
  // Hero
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroGifUrl: string | null;
  heroWireframeUrl: string | null;
  heroWireframeColorUrl: string | null;
  // About preview
  aboutPreviewTitle: string | null;
  aboutPreviewText: string | null;
  aboutPreviewImageUrl: string | null;
  // Contact info panel
  contactEmail: string | null;
  responseTimeText: string | null;
  basedInText: string | null;
  updatedAt: Date;
}
```

## Важные замечания

- **Язык интерфейса:** только английский
- **Публикация:** `hidden = true` по умолчанию — работы/статьи доступны только по прямой ссылке до снятия флага
- **Featured:** только работы с `featured = true` и `hidden = false`
- **Dual URL isMain:** main-статья на `/about` (hub) **и** `/blog/[slug]`; **canonical `/about` = `/about`**, canonical `/blog/[slug]` = `/blog/[slug]` (независимо)
- **CAL_COM_URL:** optional при деплое — CTA скрыты без URL
- **Contact form:** обязательные поля — name, email, **message** (решение Pass 1 review)
- **Contact-секция:** один и тот же полный компонент на всех страницах (не упрощённый footer)
- **Волны:** реализовать полноценно по референсу Kenney, не SVG-заглушку
- **Wireframe-эффект:** desktop — opacity от Y-позиции курсора в Hero; mobile — от scroll progress всей страницы
- **mdxEditor:** обязателен с первой версии, без отдельного preview
- **Спам/уведомления:** не нужны
- **Аналитика:** не нужна
- **Контент:** наполняется через админку после деплоя (3 работы на старт)

## Переменные окружения

```
DATABASE_URL
ADMIN_PASSWORD
SESSION_SECRET
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
CAL_COM_URL
NEXT_PUBLIC_CAL_COM_URL
NEXT_PUBLIC_SITE_URL
```

## Открытые вопросы (не блокируют разработку)

1. Конкретный домен — добавить в sitemap и env после покупки
2. Финальная палитра и шрифты — placeholder на первой версии, легко меняются через CSS-переменные

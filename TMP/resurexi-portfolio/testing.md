# Ручное тестирование — resurexi portfolio

Чеклист для проверки реализации plan-execute-loop (Tasks 01–27).  
Отмечай `[x]` по мере прохождения.

**Связанные файлы:** `_plan.md`, `checklist.md`, `log.md`, `README.md`

---

## Перед началом

### Окружение

```bash
cd ~/Projects/resurexi-portfolio
pnpm install
cp .env.example .env   # если ещё не создан
pnpm db:push
pnpm dev
```

| Переменная | Для теста |
|------------|-----------|
| `DATABASE_URL` | Локальный Postgres. Если контейнер на порту **5436**: `postgresql://postgres:password@localhost:5436/_t3tmp` |
| `ADMIN_PASSWORD` | Любой пароль ≥12 символов (запомнить для логина) |
| `SESSION_SECRET` | ≥32 символов, например `openssl rand -base64 32` |
| `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` | Из [uploadthing.com/dashboard](https://uploadthing.com/dashboard) — нужны для загрузки медиа |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (опционально в dev) |
| `CAL_COM_URL` / `NEXT_PUBLIC_CAL_COM_URL` | Опционально — без них кнопки «Book a call» скрыты |

### URL для проверки

| Страница | URL |
|----------|-----|
| Главная | http://localhost:3000/ |
| Work Gallery | http://localhost:3000/work |
| About | http://localhost:3000/about |
| Статья блога | http://localhost:3000/blog/[slug] |
| Работа | http://localhost:3000/work/[slug] |
| Админка | http://localhost:3000/admin |
| Логин | http://localhost:3000/admin/login |
| Sitemap | http://localhost:3000/sitemap.xml |
| Robots | http://localhost:3000/robots.txt |

### Рекомендуемый порядок

1. **Админка** — создать минимальный контент (категории, 2–3 работы, статья, ссылки, hero).
2. **Публичный сайт** — проверить отображение и навигацию.
3. **Граничные случаи** — hidden, featured, draft, 404.
4. **SEO и техническое** — sitemap, robots, metadata.

---

## 1. Админка — авторизация (Task 04)

- [ ] `/admin` без сессии → редирект на `/admin/login`
- [ ] Неверный пароль → сообщение об ошибке, вход не выполняется
- [ ] Верный `ADMIN_PASSWORD` → редирект в админку (`/admin/requests`)
- [ ] После логина прямой заход на `/admin/login` → редирект в dashboard
- [ ] Logout в header админки → сессия сброшена, `/admin` снова требует логин
- [ ] Публичный Header **не** показывается на страницах `/admin/*`

---

## 2. Админка — layout и навигация (Task 20)

- [ ] Sidebar: Requests, Work, Blog, Content, Contact
- [ ] Активный пункт подсвечивается на текущем разделе
- [ ] На `/admin/work/*` — sub-nav: **Works** | **Categories**
- [ ] Mobile: hamburger открывает drawer с тем же меню
- [ ] Badge на Requests показывает число непрочитанных (см. раздел 3)

---

## 3. Админка — Requests (Task 21)

**Подготовка:** отправить форму на главной (раздел 8).

- [ ] Список заявок: Name, Email, Company, Date, Status
- [ ] Новая заявка помечена как **Unread** (dot, semibold, badge)
- [ ] Клик по строке раскрывает полные данные (message, phone)
- [ ] «Mark as read» → статус меняется, badge в sidebar уменьшается
- [ ] Empty state «No requests yet» при пустой БД

---

## 4. Админка — Categories (Task 22)

- [ ] `/admin/work/categories` — таблица категорий
- [ ] **Add Category** → modal, slug автогенерируется из name
- [ ] Slug можно отредактировать вручную
- [ ] Edit сохраняет изменения
- [ ] Delete пустой категории — успех
- [ ] Delete категории, привязанной к работам — блокировка с сообщением
- [ ] Дубликат slug — ошибка

**Тестовые данные:** `Stills`, `Animation`, `Product Viz`

---

## 5. Адminка — Work CRUD (Task 23)

### Список `/admin/work`

- [ ] Таблица: cover, title, featured, hidden, categories, actions
- [ ] Фильтры: All / Published / Hidden
- [ ] «Manage Categories →» ведёт на `/admin/work/categories`
- [ ] **New Work** → форма создания

### Форма create/edit

- [ ] Title* и slug* (slug auto из title)
- [ ] Subtitle (optional)
- [ ] Cover upload (ImageUploader), GIF сохраняет анимацию (`coverIsAnimated`)
- [ ] Gallery: несколько изображений, drag-reorder меняет порядок
- [ ] YouTube URLs: добавление/удаление, валидация URL
- [ ] Categories: multi-select checkboxes
- [ ] Description: **MdxEditor** (WYSIWYG), загрузка картинок в текст
- [ ] Featured checkbox
- [ ] Hidden checkbox (**default true** при создании)
- [ ] SEO: metaTitle, metaDescription, ogImage upload
- [ ] Save блокируется во время upload
- [ ] Delete work — confirm dialog

**Минимум для публичных тестов:**

| Работа | featured | hidden | Заметка |
|--------|----------|--------|---------|
| Work A | ✅ | ❌ | Показывается в Featured + /work |
| Work B | ❌ | ❌ | Только в /work |
| Work C | ✅ | ✅ | Draft — только по прямой ссылке |

---

## 6. Админка — Blog CRUD (Task 24)

- [ ] `/admin/blog` — список: Title, Main, Hidden, Updated
- [ ] **New post** / edit по id
- [ ] Поля: title, subtitle, slug, cover, content (MdxEditor), isMain, hidden, SEO
- [ ] **isMain=true** на одной статье снимает флаг с предыдущей main
- [ ] hidden default **true** при создании
- [ ] Предупреждение при скрытии main-поста (isMain + hidden)

**Тестовые данные:**

- Main About article: `isMain=true`, `hidden=false`, MDX с заголовками и картинкой
- Вторая статья: `isMain=false`, `hidden=false` — для карточек на `/about`

---

## 7. Админка — Content (Task 25)

`/admin/content` — три таба:

### Hero

- [ ] Title, subtitle
- [ ] GIF upload (heroImageUploader, до 16MB)
- [ ] Wireframe B&W + color uploads
- [ ] Save → `content.updateHero`
- [ ] «View on site →» открывает `/#hero`

### About Preview

- [ ] Title, text, image
- [ ] Save → изменения на главной в секции About
- [ ] «View on site →» → `/#about`

### Contact Info

- [ ] Email, response time, based in
- [ ] Save → отображается в Contact info panel на сайте

---

## 8. Админка — Contact links (Task 26)

- [ ] `/admin/contact` — список ссылок
- [ ] **Add Link** → label*, url*, icon (upload или external URL)
- [ ] Quick-add шаблоны **Telegram** / **WhatsApp**
- [ ] Drag-reorder → порядок на сайте совпадает
- [ ] Edit / Delete
- [ ] Empty list → social grid на сайте скрыт

---

## 9. Админка — Uploadthing (Task 09)

- [ ] Upload без admin-сессии → 403 (можно проверить через curl или devtools)
- [ ] Cover / gallery / hero GIF загружаются и показывают preview
- [ ] Delete в UI убирает URL из формы (файл на CDN может остаться — ожидаемо для v1)
- [ ] GIF в gallery/cover анимируется на публичном сайте

---

## 10. Главная страница `/` (Tasks 10–14)

### Header (Task 07)

- [ ] Фиксированный header, logo «resurexi»
- [ ] Навигация: Work → `/work`, About → `/about`, Contact → scroll к `#contact`
- [ ] На главной: Work/About/Contact скроллят к секциям (smooth scroll)
- [ ] Theme toggle: light / dark / system
- [ ] «Book a call» — видна только если задан `NEXT_PUBLIC_CAL_COM_URL`
- [ ] Mobile menu: hamburger, overlay, закрытие по клику

### Hero (Task 10)

- [ ] Fullscreen фон: GIF или gradient fallback
- [ ] Title/subtitle из Content admin (или placeholder)
- [ ] Wireframe dual-layer: **desktop** — opacity от Y-позиции курсора; **mobile** — от scroll
- [ ] WhatsApp/Telegram иконки из contact links (не в social grid)
- [ ] `prefers-reduced-motion` — wireframe ~50% opacity (проверить в devtools → Rendering)

### Featured Work (Task 11)

- [ ] Секция на accent A фоне с **волнами** (Kenney-style, анимация)
- [ ] Только works с `featured=true` **и** `hidden=false`
- [ ] Карточки: cover (GIF анимируется), title, subtitle, category pills
- [ ] «View all work →» → `/work`
- [ ] Empty state если нет featured works
- [ ] `id="featured-work"` — scroll из header работает

### About preview (Task 12)

- [ ] Default background (не accent)
- [ ] Title, text, optional image из Content
- [ ] «Learn more» → `/about`
- [ ] `id="about"`

### Contact (Task 13)

- [ ] Accent B фон + **волны** (только на главной, `variant="home"`)
- [ ] Форма: name*, email*, message*, company/phone optional
- [ ] Валидация пустых обязательных полей
- [ ] Успешная отправка → success message
- [ ] Contact info panel: email, response time, based in
- [ ] Social links grid из admin
- [ ] `id="contact"`

### Общая компоновка (Task 14)

- [ ] Порядок секций: Hero → Featured → About → Contact
- [ ] Чередование фонов: default → A → default → B
- [ ] Переходы между секциями без 1px seam (волны overlap)

---

## 11. Work Gallery `/work` (Task 15)

- [ ] PageHero с заголовком
- [ ] Masonry grid (3 / 2 / 1 колонки на desktop / tablet / mobile)
- [ ] Filter pills: All + категории
- [ ] Поиск по title и category name (AND с фильтром)
- [ ] Только works с `hidden=false`
- [ ] Empty state
- [ ] ContactSection внизу (`variant="page"` — без accent B волн)
- [ ] Клик по карточке → `/work/[slug]`

---

## 12. Страница работы `/work/[slug]` (Task 16)

- [ ] Title, subtitle, categories
- [ ] Cover image
- [ ] Gallery в порядке `order`, GIF анимируются
- [ ] YouTube embeds (responsive)
- [ ] MDX description рендерится (prose)
- [ ] ContactSection внизу
- [ ] **Hidden work** (`hidden=true`): доступен по URL, banner «Draft»
- [ ] Несуществующий slug → **404**

---

## 13. About `/about` (Task 17)

- [ ] Main article из `blog.getMain` (`isMain=true`, `hidden=false`)
- [ ] MDX контент, optional cover
- [ ] «Read full story» → `/blog/[slug]` main-статьи
- [ ] Карточки остальных статей (`listPublic`, без isMain)
- [ ] Empty state без main post
- [ ] ContactSection внизу
- [ ] Metadata: title «About — resurexi», canonical `/about`

---

## 14. Статья `/blog/[slug]` (Task 18)

- [ ] Title, subtitle, date
- [ ] Optional cover
- [ ] MDX body
- [ ] Hidden post: доступен по URL, draft banner
- [ ] Invalid slug → 404
- [ ] ContactSection внизу
- [ ] Main article доступна и здесь, и на `/about` (dual URL)

---

## 15. Cal.com popup (Task 08)

_Только если настроены env vars._

- [ ] «Book a call» в Header открывает modal
- [ ] Backdrop затемняет страницу, клик / Esc закрывает
- [ ] Cal.com embed загружается (lazy при первом открытии)
- [ ] Кнопка в Hero и Contact section работает так же

**Без Cal.com URL:** все Book a call кнопки **скрыты** — проверить отсутствие.

---

## 16. Темизация и UI (Task 05)

- [ ] Light / dark / system theme переключается без мерцания
- [ ] Segment colors (accent A/B) корректны в обеих темах
- [ ] Кнопки, inputs, modals выглядят согласованно
- [ ] MDX prose читаем в light и dark

---

## 17. SEO и техническое (Task 19)

- [ ] `/sitemap.xml` — `/`, `/work`, `/about`, public works/posts
- [ ] Hidden works/posts **не** в sitemap
- [ ] `/robots.txt` — allow `/`, disallow `/admin`
- [ ] View Source / devtools → `<title>`, `description`, `og:*` на главной, work, blog, about
- [ ] Hidden страница: `<meta name="robots" content="noindex">` (или robots noindex в metadata)
- [ ] `/og-default.png` отдаётся (1200×630)
- [ ] Canonical: `/about` → `/about`, `/blog/[slug]` → `/blog/[slug]`

---

## 18. Responsive и браузеры

Проверить на ширинах ~375px, ~768px, ~1280px:

- [ ] Header mobile menu
- [ ] Hero wireframe (scroll vs cursor)
- [ ] Featured grid 2→1 col
- [ ] Work masonry
- [ ] Contact form layout
- [ ] Admin sidebar → drawer

Опционально: Chrome, Firefox, Safari.

---

## 19. Бизнес-правила (регрессия)

| Правило | Как проверить |
|---------|---------------|
| Новая work/post **hidden=true** по умолчанию | Создать без снятия hidden → нет в /work и Featured |
| Featured только при featured+!hidden | Work C: featured+hidden → не в Featured, но URL открывается |
| isMain exclusivity | Две main статьи одновременно невозможны |
| Contact message **required** | Отправка без message → ошибка валидации |
| Язык UI | Только английский |
| Волны на subpages Contact | `/work`, `/about`, `/blog/*` — Contact **без** accent B волн |

---

## 20. Production-only (после деплоя, Task 27)

- [ ] `pnpm build` на Vercel проходит
- [ ] `DATABASE_URL` (Neon pooled) + `pnpm db:push` к prod
- [ ] `NEXT_PUBLIC_SITE_URL` = финальный домен
- [ ] Secure cookies: login на HTTPS, session сохраняется
- [ ] Cold start Neon (~1–2 s) — страница всё равно грузится
- [ ] Smoke test из README.md пройден

---

## Быстрый smoke (5 минут)

Если времени мало — минимальный проход:

1. [ ] Login `/admin` → создать 1 category, 1 featured work (hidden=false)
2. [ ] Content → Hero title → видно на главной
3. [ ] Главная: 4 секции, theme toggle, scroll Contact
4. [ ] `/work` — карточка видна, клик → detail
5. [ ] Contact form → заявка в Admin → Requests
6. [ ] `/sitemap.xml` открывается

---

## Заметки при тестировании

_Используйте это поле для багов и наблюдений:_

```
Дата:
Окружение: local / staging / prod
Браузер:

Issue 1:
Issue 2:
```

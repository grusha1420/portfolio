# Review Log

Журнал проходов plan-review-loop. Реализационный лог — в `log.md`.

---

## Pass 1 — 2026-08-15 23:26:37 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Converged:** нет

### Counts

🔴 critical: 2  
🟠 serious: 8  
🟡 minor: 6  
🔵 nit: 4

### Findings

#### 🔴 Критические

- [Task 03, Task 13] Поле `message` в форме Contact помечено обязательным (`message (required)`, `Message*`), но в `план портфолио/уточнения.md` обязательными указаны только **имя** и **email** (`Имя*, … email*, телефон, сообщение` — звёздочки только у имени и email). Реализация по плану нарушит согласованные требования. → править: `task-03.md`, `task-13.md`

- [Task 16, Task 18] MDX-рендерер описан дважды в разных задачах без явной зависимости: Task 16 создаёт `WorkDescription.tsx`, Task 18 — общий `MDXContent.tsx` «shared between work page, about, blog». Task 16 выполняется **раньше** Task 18, что приведёт к дублированию или переписыванию. Нужна одна задача/компонент и явный порядок (вынести MDX-инфраструктуру в Task 03/05 или сделать Task 18 зависимостью Task 16/17). → править: `_plan.md`, `task-16.md`, `task-18.md`

#### 🟠 Серьёзные

- [Task 01] `@mdxeditor/editor` — обязателен с v1 (уточнения), но совместимость с React 19 / Next.js 15 только «проверить»; нет fallback (pin версий, downgrade React, альтернативный редактор). Риск блокера на Task 24. → править: `task-01.md`, `_plan.md`

- [Task 03, Task 20, Task 21] `contact.getUnreadCount` требуется для badge в sidebar (Task 20/21), но в спецификации Task 03 перечислены только `listRequests`, `markRead`, CRUD links — `getUnreadCount` отсутствует. → править: `task-03.md`

- [Task 03, Task 26] `contact.reorderLinks` нужен для сортировки ссылок (Task 26), но в Task 03 для admin contact указан только CRUD без reorder. → править: `task-03.md`

- [Task 03, Task 17] Политика `isMain` + `hidden` не зафиксирована: Task 17 содержит противоречивые варианты («show isMain even if hidden» vs «isMain must be hidden=false»), Task 03 для `blog.getMain` не описывает фильтр по `hidden`. → править: `task-03.md`, `task-17.md`, `_plan.md`

- [Task 19] Скрытые работы/статьи (`hidden=true`) исключены из sitemap, но доступны по прямой ссылке — план не предусматривает `<meta name="robots" content="noindex">` для draft/hidden страниц. Риск индексации черновиков при утечке URL. → править: `task-19.md`, `task-16.md`, `task-18.md`

- [Task 11, Task 15, Task 16] Концепт допускает **анимированные GIF** в карточках работ («изображений или гифок»); план использует `next/image` без оговорки об анимации GIF (по умолчанию анимация может быть отключена). → править: `task-11.md`, `task-15.md`, `task-16.md`

- [Task 01, Task 16, Task 23] Зависимости `@tailwindcss/typography` (Task 16) и `@dnd-kit/*` (Task 23 gallery reorder) используются, но не установлены в Task 01. → править: `task-01.md`

- [Task 04] Session signing через `ADMIN_PASSWORD` (или неописанный `SESSION_SECRET`) — `SESSION_SECRET` не в env-списках `_plan.md` / Task 01 / Task 27; переиспользование пароля для HMAC снижает безопасность. → править: `task-04.md`, `_plan.md`, `task-27.md`

#### 🟡 Умеренные

- [Task 20, Task 22, Task 23] CRUD категорий запланирован на `/admin/work/categories`, но sidebar Task 20 содержит только 5 пунктов без Categories; Task 23 не описывает ссылку «Manage categories» из Work admin. Риск «потерянной» функции. → править: `task-20.md`, `task-22.md`, `task-23.md`

- [Task 13, Task 25] Contact Info panel (Response time, Based in, email) — статический placeholder; не редактируется в Content admin, хотя референс contact.png показывает структурированный info-блок. → править: `task-13.md` или `task-25.md`

- [Task 10] WhatsApp/Telegram в Hero фильтруются эвристикой (`url contains wa.me / t.me`), а не явным флагом/order в `contact_links` — хрупко при кастомных URL. → править: `task-10.md`, опционально `task-02.md`

- [_plan.md, Task 01, Task 19] `NEXT_PUBLIC_SITE_URL` нужен для sitemap/OG/canonical (Task 19/27), но отсутствует в env-блоке `_plan.md` и `.env.example` Task 01 — добавляется только поздно. → править: `_plan.md`, `task-01.md`

- [Task 01] Устанавливаются и `@next/mdx`, и `next-mdx-remote` без выбора одного подхода — риск раздвоения MDX-стека. → править: `task-01.md`

- [_plan.md, checklist.md] Task 07 в `_plan.md` зависит от Task 08; в `checklist.md` Task 07 ждёт только Task 05 — расхождение документов. → править: `_plan.md` или `checklist.md`

#### 🔵 Незначительные

- [Task 23] Work description: «textarea OR mdxEditor» — для блога mdxEditor обязателен, для работ — Markdown по концепту; неоднозначность UX, но не блокер если зафиксировать textarea + MDX syntax helper. → править: `task-23.md`

- [Task 09] Удаление изображения в UI не удаляет файл с Uploadthing CDN — orphan files (приемлемо для v1, но стоит упомянуть). → править: `task-09.md`

- [Task 08] Опциональный zustand для Cal.com state — не в зависимостях Task 01 (OK если Context). → править: `task-08.md`

- Общее: нет задачи на кастомную 404-страницу (Next.js default достаточен для v1).

### Сверка с кодом

Репозиторий **greenfield**: `package.json` и исходников приложения нет — только план и `план портфолио/`. Сверка выполнена против `концепт.md`, `уточнения.md` и внутренней согласованности 27 task-файлов.

**Покрытие концепта (положительное):** T3 stack, 4 сегмента главной, WaveDivider, wireframe Hero, Cal.com popup, Featured/Work Gallery/About/Blog, Contact на всех страницах, admin (Requests/Work/Blog/Content/Contact), SEO sitemap/robots, деплoy Vercel+Neon — всё отражено в задачах.

### Questions for user

1. Поле **message** в Contact-форме — обязательное или опциональное? (уточнения: только name+email обязательны; task-03/13: message обязателен)
2. Статья с `isMain=true` и `hidden=true` — показывать на `/about` или скрывать до публикации?
3. Work description в админке — **textarea с MDX-синтаксисом** (как в концепте «Markdown») или **тот же mdxEditor**, что и для блога?
4. Contact Info panel (Response time, Based in, email) — **статический английский текст** или редактируемый блок в Content admin?
5. Cover-изображения работ в формате **анимированный GIF** — нужна гарантия анимации на карточках Featured/Work Gallery?

### Fixes applied (orchestrator) — 2026-08-15 23:31:33 +04

**User decisions (Pass 1 Q&A):**
- message — **required** (подтверждено пользователем)
- isMain + hidden — **не показывать** на /about до hidden=false
- Work editor — **mdxEditor** (shared с Blog)
- Contact Info — **Content admin** (site_content key='contact_info')
- GIF covers — **MediaImage unoptimized**

- [Task 05] task-05.md: MDXContent + MediaImage (shared MDX infra)
- [Task 16/18] task-16.md, task-18.md: use MDXContent from Task 05, no duplicate
- [Task 01] task-01.md: typography, dnd-kit, next-mdx-remote only, mdxEditor contingency, SESSION_SECRET, SITE_URL
- [Task 03] task-03.md: getUnreadCount, reorderLinks, blog.getMain hidden=false, contact info API
- [Task 04] task-04.md: SESSION_SECRET only for signing
- [Task 02] task-02.md: site_content contact_info fields
- [Task 13/25] task-13.md, task-25.md: Contact Info from CMS
- [Task 17] task-17.md: isMain policy fixed
- [Task 19] task-19.md: noindex for hidden pages
- [Task 11/15] task-11.md, task-15.md: MediaImage for GIF
- [Task 20/22/23] task-20.md, task-23.md: Categories nav; Task 23 depends Task 24 for MdxEditor
- [Task 24] task-24.md: MdxEditor shared export for Work
- [Task 27] task-27.md: SESSION_SECRET in env
- [_plan.md] deps, env, SiteContent type, execution order (24 before 23)
- [checklist.md] Task 07 waits 08; Task 23 waits 24


- [Task 03] `task-03.md`: убрать required у message (если подтвердит пользователь); добавить `getUnreadCount`, `reorderLinks`; зафиксировать фильтр `blog.getMain` (`hidden=false`)
- [Task 16/18] `_plan.md`: вынести shared `MDXContent` раньше (Task 05 или 03) или добавить Task 18 как зависимость Task 16/17
- [Task 01] `task-01.md`: добавить `@tailwindcss/typography`, `@dnd-kit/core`, `@dnd-kit/sortable`; выбрать один MDX-пакет; добавить `NEXT_PUBLIC_SITE_URL`; contingency для mdxEditor
- [Task 04] `task-04.md`: отдельный `SESSION_SECRET` в env
- [Task 19] `task-19.md`: `noindex` для `hidden=true` страниц
- [Task 20/22] `task-20.md`: навигация к Categories из Work admin

---

## Pass 2 — 2026-08-15 23:31:41 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 2 | 🟡 4 | 🔵 2  
**Converged:** нет

### Findings

#### 🔴 Критические

_нет — все 🔴 Pass 1 закрыты_

**Верификация исправлений Pass 1 (критические):**
- message required — подтверждено пользователем; `_plan.md`, `task-03.md`, `task-13.md` согласованы ✅
- MDX-дублирование — `MDXContent` вынесен в Task 05; Task 16/18 импортируют, не создают ✅

#### 🟠 Серьёзные

- [Task 20, Task 03, Task 21] Несогласованное имя tRPC-процедуры для badge: Task 03 и Task 21 — `contact.getUnreadCount`, Task 20 — `contact.unreadCount`. При реализации sidebar badge может вызвать несуществующий endpoint. → править: `task-20.md`

- [Task 22, Task 20, Task 23] Маршрут Categories: Task 20/23/_plan.md фиксируют `/admin/work/categories`, но Task 22 указывает файл `src/app/admin/categories/page.tsx` (URL `/admin/categories`). Ссылка «Manage Categories» и sub-nav Works|Categories приведут к 404. → править: `task-22.md`

**Верификация исправлений Pass 1 (серьёзные):**
- getUnreadCount, reorderLinks в Task 03 ✅ (имя в Task 20 — см. выше)
- isMain + hidden=false на /about — Task 03, 17, `_plan.md` ✅
- noindex для hidden — Task 19 ✅
- MediaImage GIF — Task 05, 11, 15, 16 ✅
- SESSION_SECRET — Task 04, 01, 27, `_plan.md` ✅
- mdxEditor contingency — Task 01 ✅
- deps typography/dnd-kit — Task 01 ✅
- Categories nav — Task 20 sub-nav, Task 23 link ✅ (путь файла Task 22 — см. выше)
- Contact Info CMS — Task 02, 03, 13, 25 ✅
- mdxEditor Work — Task 24 создаёт, Task 23 использует; порядок в `_plan.md` ✅

#### 🟡 Умеренные

- [Task 26] Устаревшая заметка «Response time / based in text — static on public site unless added to Content later» противоречит CMS-решениям Task 13/25. → править: `task-26.md`

- [Task 05, Task 24] `MDXContent` не описывает `components`-map для `next-mdx-remote` (img → MediaImage/next/image). Inline-изображения из mdxEditor могут рендериться без оптимизации или сломаться, если редактор выводит нестандартный JSX. → править: `task-05.md`, опционально `task-24.md`

- [Task 10] WhatsApp/Telegram в Hero по-прежнему фильтруются эвристикой URL (`wa.me`/`t.me`), без явного типа/linkKind в `contact_links` — хрупко (не исправлено с Pass 1). → править: `task-10.md` или `task-02.md`

- [Task 27] Post-deploy checklist не упоминает **Content → Contact Info** (email, response time, based in), хотя поля редактируются в Task 25. → править: `task-27.md`

#### 🔵 Незначительные

- [Task 01] Структура каталогов: `src/components/blog/` — «BlogCard, MDXContent», но MDXContent перенесён в `src/components/mdx/` (Task 05). → править: `task-01.md`

- [Task 13] В «Зависимости» не указан `content.getContactInfo` (используется в шаге 4). → править: `task-13.md`

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников нет. Сверка выполнена по внутренней согласованности 27 task-файлов, `_plan.md`, `checklist.md` и `план портфолио/уточнения.md`.

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- [Task 20] `task-20.md`: заменить `contact.unreadCount` → `contact.getUnreadCount`
- [Task 22] `task-22.md`: файл `src/app/admin/work/categories/page.tsx`; убрать `/admin/categories`
- [Task 26] `task-26.md`: удалить/обновить заметку про static Contact Info
- [Task 05] `task-05.md`: добавить MDX components map (img, a, …) для совместимости с mdxEditor
- [Task 27] `task-27.md`: добавить Contact Info в post-deploy checklist
- [Task 01] `task-01.md`: обновить структуру папок (mdx/ вместо MDXContent в blog/)


---

## Pass 2 — 2026-08-15 23:31:41 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 2 | 🟡 4 | 🔵 2  
**Converged:** нет

### Findings

#### 🔴 Критические

_нет — все 🔴 Pass 1 закрыты_

**Верификация исправлений Pass 1 (критические):**
- message required — подтверждено пользователем; `_plan.md`, `task-03.md`, `task-13.md` согласованы ✅
- MDX-дублирование — `MDXContent` вынесен в Task 05; Task 16/18 импортируют, не создают ✅

#### 🟠 Серьёзные

- [Task 20, Task 03, Task 21] Несогласованное имя tRPC-процедуры для badge: Task 03 и Task 21 — `contact.getUnreadCount`, Task 20 — `contact.unreadCount`. При реализации sidebar badge может вызвать несуществующий endpoint. → править: `task-20.md`

- [Task 22, Task 20, Task 23] Маршрут Categories: Task 20/23/_plan.md фиксируют `/admin/work/categories`, но Task 22 указывает файл `src/app/admin/categories/page.tsx` (URL `/admin/categories`). Ссылка «Manage Categories» и sub-nav Works|Categories приведут к 404. → править: `task-22.md`

**Верификация исправлений Pass 1 (серьёзные):**
- getUnreadCount, reorderLinks в Task 03 ✅ (имя в Task 20 — см. выше)
- isMain + hidden=false на /about — Task 03, 17, `_plan.md` ✅
- noindex для hidden — Task 19 ✅
- MediaImage GIF — Task 05, 11, 15, 16 ✅
- SESSION_SECRET — Task 04, 01, 27, `_plan.md` ✅
- mdxEditor contingency — Task 01 ✅
- deps typography/dnd-kit — Task 01 ✅
- Categories nav — Task 20 sub-nav, Task 23 link ✅ (путь файла Task 22 — см. выше)
- Contact Info CMS — Task 02, 03, 13, 25 ✅
- mdxEditor Work — Task 24 создаёт, Task 23 использует; порядок в `_plan.md` ✅

#### 🟡 Умеренные

- [Task 26] Устаревшая заметка «Response time / based in text — static on public site unless added to Content later» противоречит CMS-решениям Task 13/25. → править: `task-26.md`

- [Task 05, Task 24] `MDXContent` не описывает `components`-map для `next-mdx-remote` (img → MediaImage/next/image). Inline-изображения из mdxEditor могут рендериться без оптимизации или сломаться, если редактор выводит нестандартный JSX. → править: `task-05.md`, опционально `task-24.md`

- [Task 10] WhatsApp/Telegram в Hero по-прежнему фильтруются эвристикой URL (`wa.me`/`t.me`), без явного типа/linkKind в `contact_links` — хрупко (не исправлено с Pass 1). → править: `task-10.md` или `task-02.md`

- [Task 27] Post-deploy checklist не упоминает **Content → Contact Info** (email, response time, based in), хотя поля редактируются в Task 25. → править: `task-27.md`

#### 🔵 Незначительные

- [Task 01] Структура каталогов: `src/components/blog/` — «BlogCard, MDXContent», но MDXContent перенесён в `src/components/mdx/` (Task 05). → править: `task-01.md`

- [Task 13] В «Зависимости» не указан `content.getContactInfo` (используется в шаге 4). → править: `task-13.md`

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников нет. Сверка выполнена по внутренней согласованности 27 task-файлов, `_plan.md`, `checklist.md` и `план портфолио/уточнения.md`.

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- [Task 20] `task-20.md`: заменить `contact.unreadCount` → `contact.getUnreadCount`
- [Task 22] `task-22.md`: файл `src/app/admin/work/categories/page.tsx`; убрать `/admin/categories`
- [Task 26] `task-26.md`: удалить/обновить заметку про static Contact Info
- [Task 05] `task-05.md`: добавить MDX components map (img, a, …) для совместимости с mdxEditor
- [Task 01] `task-01.md`: обновить структуру папок (mdx/ вместо MDXContent в blog/)


---

## Pass 3 — 2026-08-15 23:33:13 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 0 | 🟡 2 | 🔵 2  
**Converged:** да

### Findings

#### 🔴 Критические

_нет_

**Верификация исправлений Pass 2 (критические):**
- Все 🔴 Pass 1 остаются закрытыми ✅

#### 🟠 Серьёзные

_нет_

**Верификация исправлений Pass 2 (серьёзные):**
- `contact.getUnreadCount` — Task 03, 20, 21 согласованы; Task 20 больше не использует `contact.unreadCount` ✅
- Маршрут Categories — Task 22: `src/app/admin/work/categories/page.tsx`, URL `/admin/work/categories`; согласовано с Task 20 sub-nav и Task 23 link ✅

**Верификация minor fixes Pass 2:**
- Task 01: структура `src/components/mdx/` вместо MDXContent в blog/ ✅
- Task 05: MDX components map (img → MediaImage) ✅
- Task 26: устаревшая заметка про static Contact Info удалена; ссылка на Task 25 ✅
- Task 27: Contact Info в post-deploy content guide ✅
- Task 13: `content.getContactInfo` в зависимостях ✅

#### 🟡 Умеренные

- [Task 10] WhatsApp/Telegram в Hero по-прежнему фильтруются эвристикой URL (`wa.me`/`t.me`), без явного типа в `contact_links` — хрупко при кастомных URL (не исправлено с Pass 1/2). → править: `task-10.md` или `task-02.md` (опционально)

- [Task 27] В Step 4 README краткий inline-checklist (Hero, categories, works, blog, contact links) не упоминает **Contact Info**, хотя детальный блок «Post-deploy content guide» в том же файле включает его — риск пропуска при копировании только Step 4. → править: `task-27.md`

#### 🔵 Незначительные

- [Task 19] Дублирование нумерации «Шаг 2» (generateMetadata и noindex) — косметика документации. → править: `task-19.md`

- [Task 21] «invalidate unreadCount query» — generic React Query naming; не конфликтует с tRPC `contact.getUnreadCount`, но можно уточнить для единообразия. → править: `task-21.md` (опционально)

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников нет. Сверка выполнена по внутренней согласованности 27 task-файлов, `_plan.md`, `checklist.md` и `план портфолио/уточнения.md`.

**Покрытие концепта:** полный scope отражён; зависимости Task 07→08, Task 24→23, env vars, CMS Contact Info, noindex/hidden, MDX shared infra — согласованы.

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- Опционально: [Task 10] `task-10.md` — linkKind/type для WhatsApp/Telegram вместо URL-heuristic
- Опционально: [Task 27] `task-27.md` — добавить Contact Info в Step 4 inline checklist
- Опционально: [Task 19] `task-19.md` — перенумеровать шаги


---

## Pass 4 — 2026-08-15 23:36:00 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 4 | 🟡 3 | 🔵 2  
**Converged:** нет

### Findings

#### 🔴 Критические

_нет_

**Верификация исправлений Pass 3 (критические/серьёзные):**
- Pass 3 закрывал все 🔴/🟠 — регрессий по `contact.getUnreadCount`, маршруту Categories, MDXContent, SESSION_SECRET, noindex не обнаружено ✅

#### 🟠 Серьёзные

- [Task 11, _plan.md, checklist.md] Task 11 шаг 3 требует `ColoredSegment` + `WaveDivider`, но в зависимостях указаны только Task 03 и Task 05 (Task 06 отсутствует). Task 12 и Task 13 зависят от Task 06; checklist и `_plan.md` позволяют начать Task 11 параллельно с Task 06 — риск сборки Featured Work без волн («без упрощений» из уточнений). → править: `task-11.md`, `_plan.md`, `checklist.md`

- [Task 05, Task 09, Task 11, Task 15, Task 16] `MediaImage` определяет GIF по суффиксу URL (`.gif`), но Uploadthing CDN отдаёт URL без расширения (`utfs.io/f/...`). Анимированные cover-работы и inline-GIF в MDX могут рендериться через `next/image` без анимации — против решения Pass 1 (GIF covers) и концепта («изображений или гифок»). Hero GIF использует plain `<img>` (Task 10) и не затронут. → править: `task-05.md`, опционально `task-02.md` / `task-09.md` (mime/contentType)

- [Task 17, Task 18, Task 19] Статья `isMain=true` при `hidden=false` рендерится на `/about` (Task 17) и одновременно доступна по `/blog/[slug]` (`blog.getBySlug` без исключения isMain). Sitemap включает оба URL — дублированный контент и SEO-конфликт; canonical/alternate/redirect не описаны. → править: `task-03.md`, `task-17.md`, `task-18.md`, `task-19.md`, `_plan.md`

- [Task 27, Task 08] Step 1 Task 27 требует валидации `CAL_COM_URL` / `NEXT_PUBLIC_CAL_COM_URL` как обязательных («fail build if missing»), но Step 4 README и post-deploy guide (п. 9) предполагают установку Cal.com **после** первого деплоя с redeploy. Task 08 допускает скрытие кнопок при отсутствии URL. Противоречие блокирует деплой без заранее настроенного Cal.com. → править: `task-27.md`, `task-01.md` (optional vs required)

#### 🟡 Умеренные

- [Task 10] WhatsApp/Telegram в Hero фильтруются эвристикой URL (`wa.me`/`t.me`) — не исправлено с Pass 1–3; хрупко при кастомных доменах/short links. → править: `task-10.md` или `task-02.md` (опционально)

- [Task 17, Task 19] `/about` metadata: Task 17 требует description из main post, Task 19 — только static defaults для `about/page.tsx`. SEO-поля isMain-статьи (metaTitle, ogImage) не применяются к каноническому URL `/about`. → править: `task-17.md`, `task-19.md`

- [Task 27] Step 4 inline checklist (README) по-прежнему не включает **About Preview** и **Contact Info**, хотя детальный post-deploy guide их содержит — риск пропуска при деплое. → править: `task-27.md`

#### 🔵 Незначительные

- [Task 19] Дублирование нумерации «Шаг 2» (generateMetadata и noindex) — косметика. → править: `task-19.md`

- [Task 03] `works.listPublic` и `works.listAll` дублируют семантику (оба hidden=false) — избыточность API. → править: `task-03.md` (опционально)

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников приложения нет. Сверка выполнена по 27 task-файлам, `_plan.md`, `checklist.md`, `log.md` и источникам `план портфолио/концепт.md`, `уточнения.md`.

**Покрытие концепта:** полный scope (T3, 4 сегмента, волны, wireframe Hero, Cal.com popup, Work/About/Blog, Contact на всех страницах, admin, SEO, деплoy) отражён. Решения Pass 1 Q&A (message required, mdxEditor для Work, Contact Info CMS, MediaImage) сохранены.

### Вопросы пользователю

1. Статья с `isMain=true` и `hidden=false` — должна ли быть доступна по `/blog/[slug]`, или только на `/about` (а `/blog/[slug]` → redirect/404)?
2. `CAL_COM_URL` — обязателен при **первом** production-деплое, или допустим деплой без него с последующим redeploy?

### Рекомендуемые правки (для оркестратора)

- [Task 11] `task-11.md`, `_plan.md`, `checklist.md`: добавить Task 06 в зависимости
- [Task 05] `task-05.md`: GIF detection — mime/contentType из Uploadthing metadata или host-based fallback, не только `.gif` suffix
- [Task 17/18/19] зафиксировать canonical/redirect policy для isMain; sitemap — один URL
- [Task 27] `task-27.md`: CAL_COM optional at build; синхронизировать Step 4 checklist с post-deploy guide
- [Task 17/19] `generateMetadata` для `/about` из isMain post SEO fields

### Fixes applied (orchestrator) — 2026-08-15 23:37:00 +04

**User decisions (Pass 4 Q&A):**
- isMain — доступна на `/about` **и** `/blog/[slug]`; canonical → `/blog/[slug]`
- CAL_COM_URL — **optional** при первом деплое; CTA скрыты без URL

- [Task 11] task-11.md, _plan.md, checklist.md: Task 06 в зависимостях
- [Task 05/02/09/23] coverIsAnimated + isAnimated flags; MediaImage uses prop not URL suffix
- [Task 17/19] dual URL + canonical policy; sitemap only /blog/[slug] for main post
- [Task 27/01] CAL_COM optional at build

---

## Pass 5 — 2026-08-15 23:38:36 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 0 | 🟡 3 | 🔵 2  
**Converged:** да

### Findings

#### 🔴 Критические

_нет_

#### 🟠 Серьёзные

_нет_

**Верификация исправлений Pass 4 (серьёзные):**

- **Task 11 → Task 06:** `task-11.md` зависимости включают Task 06 (ColoredSegment, WaveDivider); `_plan.md` Task 11 deps и checklist «Ждёт Task 03, 05, 06» согласованы ✅
- **coverIsAnimated / isAnimated + MediaImage prop:** `task-02.md` поля в schema; `task-05.md` `isAnimated` prop, явный запрет `.gif` suffix; `task-09.md` mime detection при upload; `task-11.md`, `task-23.md` передача флагов из БД; `_plan.md` типы Work/GalleryImage ✅
- **isMain dual URL + canonical:** `_plan.md` «на `/about` и `/blog/[slug]`; canonical → `/blog/[slug]`»; `task-17.md` dual URL + canonical + Permalink; `task-19.md` sitemap только `/blog/[slug]` для main post, canonical `/about` → `/blog/[slug]`; `task-03.md` `blog.getBySlug` не исключает isMain ✅
- **CAL_COM optional at deploy:** `task-01.md` `.env.example` optional; `task-27.md` Step 1 optional + не блокировать build; `task-08.md` скрыть CTA без URL; `_plan.md` замечание ✅

#### 🟡 Умеренные

- [Task 05, Task 24] Inline-GIF в MDX-теле статей/работ: `img` → MediaImage без источника `isAnimated` (Uploadthing URL без расширения). Covers/gallery закрыты флагами БД; inline-изображения из mdxEditor по-прежнему могут рендериться через `next/image` без анимации. → править: `task-05.md` (fallback: mime при upload в MDX, data-attr, или `<img unoptimized>` для utfs.io)

- [Task 10] WhatsApp/Telegram в Hero — эвристика URL (`wa.me`/`t.me`), без linkKind в `contact_links` (не исправлено с Pass 1–4). → править: `task-10.md` или `task-02.md` (опционально)

- [Task 17, Task 19] `/about` generateMetadata: Task 17 Step 5 — description из main post + canonical; Task 19 Step 3 — static defaults для `about/page.tsx` без явного `getMain` → metaTitle/ogImage. Риск static SEO на /about при реализации по Task 19. → править: `task-19.md` (dynamic metadata из isMain post)

#### 🔵 Незначительные

- [Task 27] Step 4 README inline-checklist не включает About Preview и Contact Info (есть в post-deploy guide п. 3–4) — риск пропуска при копировании только Step 4. → править: `task-27.md`

- [Task 19] Дублирование нумерации «Шаг 2» (generateMetadata и noindex) — косметика. → править: `task-19.md`

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников приложения нет. Сверка по 27 task-файлам, `_plan.md`, `checklist.md`, `log.md` и `план портфолио/концепт.md`, `уточнения.md`.

**Покрытие концепта:** полный scope отражён; Pass 4 Q&A (dual URL isMain, CAL_COM optional) зафиксированы в плане.

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- Опционально: [Task 05] `task-05.md` — стратегия `isAnimated` для inline MDX images
- Опционально: [Task 19] `task-19.md` — dynamic `generateMetadata` для `/about` из isMain post
- Опционально: [Task 27] `task-27.md` — About Preview + Contact Info в Step 4 checklist

---

## Pass 6 — 2026-08-15 23:40:06 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 3 | 🟡 4 | 🔵 2  
**Converged:** нет

### Findings

#### 🔴 Критические

_нет_

**Верификация исправлений Pass 5 (критические/серьёзные):**
- Task 11 → Task 06, coverIsAnimated/isAnimated, isMain dual URL, CAL_COM optional — регрессий не обнаружено ✅
- contact.getUnreadCount, `/admin/work/categories`, MDXContent shared, SESSION_SECRET, noindex hidden — остаются согласованными ✅

#### 🟠 Серьёзные

- [Task 12, Task 13, Task 14, концепт] **Чередование фонов сегментов не совпадает с `концепт.md`:** концепт задаёт паттерн «общий фон → цвет A → **общий фон** → **цвет B**» для четырёх сегментов главной; план (`task-14.md` Step 3) ставит Featured=A, **About=B (цветной)**, **Contact=default (общий)**. About и Contact **переставлены** относительно концепта — Contact-сегмент не получит цветной фон B и волны, хотя по концепту должен. → править: `task-12.md`, `task-13.md`, `task-14.md`, `_plan.md`

- [Task 17, Task 19] **Противоречие в `generateMetadata` для `/about`:** Task 17 Step 5 требует description/meta из isMain-поста (`blog.getMain`); Task 19 Step 3 предписывает **static defaults** для `about/page.tsx` без вызова `getMain`. Исполнитель Task 19 может перезаписать динамические meta из Task 17 — SEO-поля isMain (metaTitle, ogImage) не попадут на `/about`, хотя SEO обязателен по концепту/уточнениям. → править: `task-19.md` (явный dynamic `generateMetadata` через `blog.getMain` + fallbacks)

- [Task 17, Task 19, _plan.md] **Page-level canonical `/about` → `/blog/[slug]` конфликтует с hub-страницей:** решение Pass 4 фиксирует canonical на blog-slug, но `/about` — не только дубликат main-статьи, а hub со списком других статей; sitemap включает `/about` как отдельную static entry. Page-level `<link rel="canonical" href="/blog/...">` сигнализирует поисковикам, что вся hub-страница — дубликат одной статьи; карточки «других статей» теряют SEO-вес URL `/about`. → править: `task-17.md`, `task-19.md`, `_plan.md` (уточнить: canonical `/about` остаётся `/about`; dual-content решается через sitemap/noindex на blog-slug или принять осознанный trade-off)

#### 🟡 Умеренные

- [Task 05, Task 24] Inline-GIF в MDX-теле (не закрыто с Pass 5): `img` → MediaImage без источника `isAnimated`; Uploadthing URL без расширения — анимация inline-GIF в статьях/описаниях работ может не работать. → править: `task-05.md` (fallback: `data-is-animated`, utfs.io heuristic, или `<img unoptimized>`)

- [Task 10] WhatsApp/Telegram в Hero — эвристика URL (`wa.me`/`t.me`) без linkKind в `contact_links` (не исправлено с Pass 1–5); кастомные домены/short links не попадут в Hero-иконки. → править: `task-10.md` или `task-02.md` (опционально)

- [Task 16] Gallery `MediaImage`: Step 3 упоминает «GIF support», но **не требует передавать `isAnimated` из `work_gallery_images`** — при реализации по Task 16 без Task 11/23 контекста GIF в галерее работ могут потерять анимацию (регрессия относительно Pass 4 fix). → править: `task-16.md`

- [Task 27] Step 4 README inline-checklist по-прежнему без **About Preview** и **Contact Info** (есть в post-deploy guide п. 3–4) — риск пропуска при деплое. → править: `task-27.md`

#### 🔵 Незначительные

- [Task 19] Дублирование нумерации «Шаг 2» (generateMetadata и noindex) — косметика. → править: `task-19.md`

- [Task 03] `works.listPublic` и `works.listAll` дублируют семантику (оба hidden=false) — избыточность API. → править: `task-03.md` (опционально)

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников приложения нет. Сверка по 27 task-файлам, `_plan.md`, `checklist.md`, `log.md` и источникам `план портфолио/концепт.md`, `уточнения.md`.

**Покрытие концепта:** полный functional scope отражён; Pass 4–5 fixes (GIF flags, isMain dual URL, CAL_COM optional) сохранены. Новые расхождения — визуальный паттерн сегментов и SEO-спецификация `/about`.

### Вопросы пользователю

1. **Чередование фонов:** следовать концепту буквально (About = общий фон, Contact = цвет B + волны) или оставить текущий план (About = B, Contact = default)?
2. **Canonical `/about`:** page-level canonical остаётся `/about` (hub-страница), или целенаправленно указывает на `/blog/[slug]` isMain-поста (как в Pass 4)?

### Рекомендуемые правки (для оркестратора)

- [Task 12/13/14] `_plan.md`, `task-14.md`: About → default bg, Contact → accent B + ColoredSegment/WaveDivider (по концепту)
- [Task 19] `task-19.md`: dynamic `generateMetadata` для `/about` из `blog.getMain`; согласовать с Task 17 Step 5
- [Task 17/19] `_plan.md`: уточнить canonical policy — `/about` canonical = `/about`, не `/blog/[slug]`
- [Task 16] `task-16.md`: явно передавать `isAnimated` из gallery items в MediaImage
- Опционально: [Task 05] inline MDX GIF strategy; [Task 27] Step 4 checklist completeness

### Fixes applied (orchestrator) — 2026-08-15 23:41:00 +04

**User decisions (Pass 6 Q&A):**
- Фоны по концепту: Hero=default → Featured=A → About=default → Contact=B
- Canonical `/about` = `/about` (hub); `/blog/[slug]` — свой canonical

- [Task 12/13/14] About=default bg; Contact=accent B + waves (`variant='home'`/`page'`)
- [Task 17/19/_plan] canonical policy; dynamic generateMetadata для /about
- [checklist] Task 12 без Task 06

---

## Pass 7 — 2026-08-15 23:43:11 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 0 | 🟡 4 | 🔵 2  
**Converged:** да

### Findings

#### 🔴 Критические

_нет_

#### 🟠 Серьёзные

_нет_

**Верификация исправлений Pass 6 (серьёзные):**

- **Чередование фонов сегментов (концепт):** `task-12.md` — default bg, без ColoredSegment; `task-14.md` Step 3 — Hero=default → Featured=A → About=default → Contact=B; `task-13.md` Step 5 — `variant='home'` = accent B + waves на `/`; `_plan.md` Task 12/13 описания согласованы ✅
- **Contact variant home/page:** `task-13.md` props `variant?: 'home' | 'page'`; homepage `variant='home'`, subpages `variant='page'` (default bg, без волн); `task-14.md` явно `variant='home'` для Contact на `/` ✅
- **Canonical policy:** `_plan.md` «canonical `/about` = `/about`», «canonical `/blog/[slug]` = `/blog/[slug]`»; `task-17.md` Step 5 — canonical `/about` = `/about`; `task-19.md` граничные случаи — без cross-canonical ✅
- **Dynamic generateMetadata для `/about`:** `task-19.md` Step 3 — `generateMetadata` через `blog.getMain`, metaTitle/metaDescription/ogImage + fallback; согласовано с `task-17.md` Step 5 ✅

**Верификация регрессий (Pass 1–5 fixes):**

- Task 11 → Task 06, coverIsAnimated/isAnimated, CAL_COM optional, getUnreadCount, MDXContent shared, noindex hidden — без регрессий ✅
- `checklist.md`: Task 12 ждёт Task 03, 05 (без Task 06 — корректно, About не использует WaveDivider) ✅

#### 🟡 Умеренные

- [Task 05, Task 24] Inline-GIF в MDX-теле: `img` → MediaImage без источника `isAnimated` (Uploadthing URL без расширения) — covers/gallery закрыты флагами БД; inline-изображения из mdxEditor могут потерять анимацию. → править: `task-05.md` (опционально)

- [Task 10] WhatsApp/Telegram в Hero — эвристика URL (`wa.me`/`t.me`) без linkKind в `contact_links` (не исправлено с Pass 1). → править: `task-10.md` или `task-02.md` (опционально)

- [Task 16] Gallery `MediaImage`: Step 3 упоминает «GIF support», но не требует явно передавать `isAnimated` из `work_gallery_images.isAnimated` — риск потери анимации в галерее работ. → править: `task-16.md`

- [Task 15, Task 16, Task 17, Task 18] Subpages используют «ContactSection at bottom» без явного `variant='page'` — контракт описан в Task 13, но page-задачи не дублируют prop; implementer может забыть. → править: `task-15.md`–`task-18.md` (одна строка `variant='page'`)

#### 🔵 Незначительные

- [Task 19] Дублирование нумерации «Шаг 3» (noindex и Pages metadata) — косметика. → править: `task-19.md`

- [Task 27] Step 4 README inline-checklist не включает About Preview и Contact Info (есть в post-deploy guide п. 3–4) — риск пропуска при копировании только Step 4. → править: `task-27.md`

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников приложения нет. Сверка по 27 task-файлам, `_plan.md`, `checklist.md`, `log.md` и `план портфолио/концепт.md`.

**Покрытие концепта:** полный scope отражён; Pass 6 Q&A (фоны по концепту, hub canonical `/about`, waves только на homepage Contact) зафиксированы в плане.

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- Опционально: [Task 16] `task-16.md` — `isAnimated={item.isAnimated}` в WorkImageGallery
- Опционально: [Task 15–18] явный `variant='page'` для ContactSection
- Опционально: [Task 05] inline MDX GIF strategy; [Task 27] Step 4 checklist; [Task 19] перенумерация шагов

---

## Pass 8 — 2026-08-15 23:44:42 +04

**Reviewer:** plan-reviewer subagent  
**Stop threshold:** critical_and_serious  
**Counts:** 🔴 0 | 🟠 0 | 🟡 5 | 🔵 3  
**Converged:** да

### Findings

#### 🔴 Критические

_нет_

**Свежая верификация Pass 1–7 (критические/серьёзные — регрессий не обнаружено):**

- message required — `_plan.md`, `task-03.md`, `task-13.md` согласованы (override uточнений зафиксирован в `_plan.md`) ✅
- MDXContent shared (Task 05) — Task 16/17/18 импортируют, не дублируют ✅
- `contact.getUnreadCount` — Task 03, 20, 21 единообразны ✅
- Categories route `/admin/work/categories` — Task 20, 22, 23 согласованы ✅
- coverIsAnimated / gallery isAnimated — schema Task 02, upload Task 09, cards Task 11/15, admin Task 23 ✅
- isMain + hidden=false на /about — Task 03, 17 ✅
- noindex hidden — Task 19 ✅
- SESSION_SECRET — Task 01, 04, 27, `_plan.md` ✅
- Task 11 → Task 06 — deps в task-11, `_plan.md`, checklist ✅
- Фоны сегментов по концепту — Task 12/13/14: Hero=default → Featured=A → About=default → Contact=B ✅
- Contact variant home/page — Task 13 контракт + Task 14 `variant='home'` ✅
- Canonical policy — `_plan.md`, Task 17, 19: `/about`→`/about`, `/blog/[slug]`→`/blog/[slug]` ✅
- Dynamic generateMetadata `/about` — Task 19 Step 3 через `blog.getMain` ✅
- CAL_COM optional at deploy — Task 01, 08, 27, `_plan.md` ✅
- mdxEditor shared Work+Blog — Task 24 создаёт, Task 23 использует; порядок 24→23 ✅

#### 🟠 Серьёзные

_нет_

#### 🟡 Умеренные

- [Task 16] Gallery `MediaImage`: Step 3 упоминает «GIF support», но не требует `isAnimated={item.isAnimated}` из `work_gallery_images` — риск потери анимации в галерее работ при реализации только по Task 16 (schema/admin закрыты в Pass 4). → править: `task-16.md`

- [Task 15–18] Subpages: «ContactSection at bottom» без явного `variant='page'`; контракт в Task 13 Step 6, но default prop не зафиксирован — implementer может забыть prop или выбрать неверный default. → править: `task-13.md` (default `'page'`), `task-15.md`–`task-18.md`

- [Task 05, Task 24] Inline-GIF в MDX-теле: `img` → MediaImage без источника `isAnimated`; Uploadthing URL без расширения — inline-GIF в статьях/описаниях работ могут не анимироваться (covers/gallery закрыты флагами БД). → править: `task-05.md` (опционально)

- [Task 02, Task 17, Task 24] **Паритет GIF для blog covers отсутствует:** `works` имеют `coverIsAnimated`, `blog_posts` — нет; Task 24 cover upload не сохраняет isAnimated; BlogPostCard/Task 18 не используют MediaImage. Менее критично чем work gallery (концепт явно упоминает GIF для работ), но та же Uploadthing-проблема. → править: `task-02.md`, `task-24.md`, `task-17.md` (опционально)

- [Task 10] WhatsApp/Telegram в Hero — эвристика URL (`wa.me`/`t.me`) без linkKind в `contact_links` (не исправлено с Pass 1). → править: `task-10.md` или `task-02.md` (опционально)

#### 🔵 Незначительные

- [Task 19] Дублирование нумерации «Шаг 3» (noindex и Pages metadata) — косметика. → править: `task-19.md`

- [Task 27] Step 4 README inline-checklist не включает About Preview и Contact Info (есть в post-deploy guide п. 3–4) — риск пропуска при копировании только Step 4. → править: `task-27.md`

- [Task 03] Router diagram: `blog.list` vs реализация `blog.listPublic`; `content` diagram без `getContactInfo` — расхождение документации внутри task-03. → править: `task-03.md`

### Сверка с кодом

Репозиторий **greenfield** — `package.json` и исходников приложения нет (только `TMP/` и `план портфолио/`). Сверка по 27 task-файлам, `_plan.md`, `checklist.md`, `log.md`, `план портфолио/концепт.md`, `уточнения.md`.

**Покрытие концепта:** полный scope (T3, 4 сегмента главной, волны Kenney, wireframe Hero, Cal.com popup, Work Gallery/About/Blog, Contact на всех страницах, admin Requests/Work/Blog/Content/Contact, SEO sitemap/robots, деплой Vercel+Neon) отражён во всех 27 задачах. Pass 6–7 Q&A (фоны, hub canonical, waves только на homepage Contact) сохранены без регрессий.

**Расхождение с uточнения.md (осознанное):** message в форме — required в плане vs optional в uточнения (решение Pass 1 Q&A, зафиксировано в `_plan.md`).

### Вопросы пользователю

_нет_

### Рекомендуемые правки (для оркестратора)

- Опционально: [Task 16] `task-16.md` — `isAnimated={item.isAnimated}` в WorkImageGallery
- Опционально: [Task 13] default `variant='page'`; [Task 15–18] явный `variant='page'`
- Опционально: [Task 05] inline MDX GIF strategy; [Task 02/24] blog coverIsAnimated parity
- Опционально: [Task 27] Step 4 checklist completeness; [Task 19] перенумерация шагов

# Task 20: Админка — layout и sidebar

## Описание

Общий layout для `/admin/*`: боковое меню с разделами (Requests, Work, Blog, Content, Contact), header с logout, badge непрочитанных requests в пункте меню. Responsive — collapsible sidebar on mobile.

## Предусловия

**Зависимости:**

- Task 04 — auth
- Task 05 — UI primitives

## План выполнения

### Шаг 1: Admin layout

**Файл:** `src/app/admin/layout.tsx`

**Структура:**

- Sidebar left fixed (width ~240px)
- Main content area scrollable
- Skip sidebar on /admin/login — use route group or conditional

### Шаг 2: Sidebar navigation

**Файл:** `src/components/admin/AdminSidebar.tsx`

**Menu items:**

| Label | Path | Icon |
|-------|------|------|
| Requests | /admin/requests | Inbox |
| Work | /admin/work | Briefcase |
| Blog | /admin/blog | FileText |
| Content | /admin/content | Layout |
| Contact | /admin/contact | Link |

**Work admin sub-nav** (header на страницах `/admin/work/*`, не в sidebar):

- Tabs/links: **Works** | **Categories** (`/admin/work/categories`)

**Что делать:**

- Active state on current route
- Requests item shows badge count from tRPC **contact.getUnreadCount**

### Шаг 3: Admin header

**Файл:** `src/components/admin/AdminHeader.tsx`

**Что делать:**

- Page title breadcrumb
- Logout button → admin.logout mutation + redirect login

### Шаг 4: Dashboard redirect

**Файл:** `src/app/admin/page.tsx`

**Что делать:**

- Redirect to /admin/requests (or first section)

### Шаг 5: Styling

**Что делать:**

- Functional admin aesthetic — clean, not public site polish
- Use same design tokens for consistency
- Dense tables/forms layout in content area

## Граничные случаи

- Unread count 0 — hide badge or show nothing
- Mobile — hamburger toggles sidebar drawer

## Критерии приёмки

- [ ] Admin layout with sidebar on all /admin/* except login
- [ ] All 5 nav items link correctly
- [ ] Unread requests badge updates
- [ ] Logout works
- [ ] /admin redirects to default section
- [ ] Mobile responsive sidebar
- [ ] Protected by auth middleware

## Дополнительные заметки

**Не делай:**

- Don't build section content — Tasks 21-26

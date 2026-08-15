# Task 21: Админка — Requests

## Описание

Раздел админки Requests: список заявок из contact form, сортировка по дате (newest first), индикатор прочитано/непрочитано, просмотр деталей, кнопка «Mark as read». Unread count для sidebar badge.

## Предусловия

**Зависимости:**

- Task 03 — contact admin procedures
- Task 20 — admin layout

## План выполнения

### Шаг 1: Requests list page

**Файл:** `src/app/admin/requests/page.tsx`

**UI:**

- Table or card list
- Columns: Name, Email, Company, Date, Status (read/unread)
- Unread rows visually distinct (bold or dot indicator)
- Click row → expand detail or navigate to detail

### Шаг 2: Request detail

**Options:**

- Inline expand OR `/admin/requests/[id]` page

**Detail shows:**

- All fields: name, company, email, phone, message
- createdAt formatted
- Mark as read button (if unread)
- Mark as unread optional (nice-to-have)

### Шаг 3: tRPC procedures

**Ensure exists:**

- contact.listRequests — admin, order by createdAt desc
- contact.markRequestRead — set isRead=true
- contact.getUnreadCount — count where isRead=false

### Шаг 4: Real-time badge update

**Что делать:**

- After markRead — invalidate unreadCount query
- Sidebar badge reflects change

## Граничные случаи

- Empty list — «No requests yet»
- Long message — scroll in detail view

## Критерии приёмки

- [ ] All form submissions visible in list
- [ ] Unread/read status clear
- [ ] Mark as read updates DB and badge
- [ ] Full message viewable
- [ ] Sorted newest first
- [ ] Empty state

## Дополнительные заметки

**Не делай:**

- Delete requests — not in concept (can skip)
- Email reply integration

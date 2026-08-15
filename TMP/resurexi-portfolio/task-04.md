# Task 04: Авторизация админки

## Описание

Реализовать простую password-based авторизацию для `/admin` через переменную окружения `ADMIN_PASSWORD`. Session через httpOnly cookie. Middleware Next.js блокирует доступ к /admin/* без сессии. Страница логина.

## Предусловия

**Зависимости:**

- Task 03 — tRPC admin procedures

## План выполнения

### Шаг 1: Session mechanism

**Что делать:**

- При успешном login — установить signed httpOnly cookie (использовать `@t3-oss/env-nextjs` + crypto HMAC или библиотеку iron-session / jose)
- Session payload: `{ isAdmin: true, exp: timestamp }`
- Secret для подписи — **только** `SESSION_SECRET` из env (отдельный от ADMIN_PASSWORD; минимум 32 символа)
- TTL сессии: 7 дней или до закрытия браузера (session cookie)

### Шаг 2: tRPC admin auth

**Что делать:**

- `admin.login` — input: password, compare с process.env.ADMIN_PASSWORD (timing-safe compare)
- `admin.logout` — clear cookie
- `admin.getSession` — check cookie validity
- protectedProcedure читает session из ctx

### Шаг 3: Next.js middleware

**Файл:** `src/middleware.ts`

**Что делать:**

- Matcher: `/admin/:path*`
- Исключение: `/admin/login`
- Redirect на /admin/login если нет valid session
- Не блокировать API routes tRPC — auth там через procedure

### Шаг 4: Login page

**Файл:** `src/app/admin/login/page.tsx`

**Что делать:**

- Простая форма: password input + submit
- Client component с tRPC mutation login
- Redirect на /admin после успеха
- Error state при неверном пароле
- Минимальный дизайн — функциональный, стилизация в Task 20

### Шаг 5: Server-side session helper

**Файл:** `src/server/auth.ts`

**Что делать:**

- getSession() для middleware и tRPC context
- createSession(), destroySession()

## Граничные случаи

- ADMIN_PASSWORD не задан — throw clear error at startup (env validation)
- Brute force — не нужен rate limit по уточнениям
- CSRF — tRPC same-origin достаточно для v1

## Критерии приёмки

- [ ] /admin без сессии → redirect /admin/login
- [ ] Верный пароль → доступ к /admin
- [ ] Неверный пароль → сообщение об ошибке
- [ ] Logout очищает сессию
- [ ] protectedProcedure возвращает UNAUTHORIZED без cookie
- [ ] Cookie httpOnly, secure в production
- [ ] /admin/login доступен без auth

## Дополнительные заметки

**Важно:**

- Один пароль для всех — достаточно по требованиям
- Не использовать NextAuth — overkill для single password

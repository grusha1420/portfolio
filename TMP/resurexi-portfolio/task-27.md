# Task 27: Деплой и production-конфигурация

## Описание

Подготовить проект к production-деплою на Vercel с Neon Postgres: env vars, build config, db push/migrate на production, README с инструкциями по setup, post-deploy checklist для наполнения контентом через админку.

## Предусловия

**Зависимости:**

- Task 19 — SEO (sitemap needs SITE_URL)
- Tasks 21–26 — admin functional for content entry

## План выполнения

### Шаг 1: Environment validation

**Файл:** `src/env.js` (T3 env)

**Ensure all vars validated:**

```
DATABASE_URL          # required
ADMIN_PASSWORD        # required
SESSION_SECRET        # required
UPLOADTHING_SECRET    # required
UPLOADTHING_APP_ID    # required
NEXT_PUBLIC_SITE_URL  # required in production (placeholder ok for first deploy)
CAL_COM_URL           # optional — Book a call скрыт без URL
NEXT_PUBLIC_CAL_COM_URL  # optional
```

**Что делать:**

- Fail build if **required** vars missing in production
- **CAL_COM_URL optional** — не блокировать build/deploy; Task 08 скрывает CTA без URL
- Document required vs optional in README

### Шаг 2: Vercel configuration

**Файлы:**

- `vercel.json` if needed (usually not for Next.js)
- Ensure `pnpm build` works
- Node version in package.json engines

**Neon:**

- Create Neon project, connection string
- Enable connection pooling if recommended (neon serverless driver optional)

### Шаг 3: Database production setup

**Что делать:**

- Run drizzle push/migrate against production DATABASE_URL
- Document one-time setup command
- No seed data — content via admin

### Шаг 4: README

**Sections:**

1. Project overview
2. Local dev setup (pnpm install, cp .env.example, db push, dev)
3. Env vars table
4. Deploy to Vercel step-by-step
5. Post-deploy: login /admin, add content checklist:
   - Set Hero content + GIF/wireframes
   - Add categories
   - Create 3 works (featured flags)
   - Create main About blog post (isMain)
   - Add contact links (WhatsApp, Telegram)
   - Set CAL_COM_URL
6. Domain setup notes (when purchased — update NEXT_PUBLIC_SITE_URL)

### Шаг 5: Production smoke test

**Checklist:**

- [ ] Homepage loads all sections
- [ ] /work gallery works
- [ ] /admin login works
- [ ] Upload works
- [ ] Form submission → Requests
- [ ] sitemap.xml accessible
- [ ] Dark/light theme
- [ ] Cal.com modal (if URL configured)

### Шаг 6: Security review

**Что делать:**

- ADMIN_PASSWORD strong requirement in README
- httpOnly secure cookies in production
- /admin not in sitemap
- No secrets in client bundle

## Граничные случаи

- Vercel free tier limits — note in README
- Neon sleep on free tier — cold start acceptable
- Uploadthing free tier limits

## Критерии приёмки

- [ ] `pnpm build` succeeds with production env
- [ ] README complete with setup and deploy instructions
- [ ] All env vars documented in .env.example
- [ ] NEXT_PUBLIC_SITE_URL used in sitemap/OG
- [ ] Production db schema applied
- [ ] Smoke test checklist documented
- [ ] Post-deploy content guide included

## Дополнительные заметки

**Не делай:**

- Don't purchase domain — TBD per clarifications
- Don't add analytics
- Don't setup CI beyond Vercel default — optional GitHub integration note only

## Post-deploy content guide (for README)

After first deploy, owner should:

1. Login at `/admin` with ADMIN_PASSWORD
2. **Content → Hero:** add title, subtitle, upload GIF + wireframe layers
3. **Content → About Preview:** add teaser text
4. **Content → Contact Info:** email, response time, based in
5. **Contact links:** add WhatsApp, Telegram, social links with icons
6. **Work → Categories:** create categories (e.g. Stills, Animation)
7. **Work:** create 3 works, upload covers, mark featured, set hidden=false
8. **Blog:** create main About article (isMain=true, hidden=false)
9. Set CAL_COM_URL in Vercel env and redeploy if needed

# resurexi — Portfolio

Portfolio website for 3D designer Anastasia Maidannikova (resurexi). Single-page homepage with Hero, Featured Work, About, and Contact sections, plus work gallery, blog, and a password-protected admin panel for content management.

**Stack:** Next.js 15 (App Router), Tailwind CSS, tRPC, Drizzle ORM, Neon Postgres, Uploadthing, mdxEditor, Cal.com embed, next-themes.

## Local development

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (local Docker or [Neon](https://neon.tech) dev branch)

### Setup

```bash
pnpm install
cp .env.example .env
# Edit .env — see Environment variables below
pnpm db:push
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin).

### Useful commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run production build locally |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Drizzle Studio GUI |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `ADMIN_PASSWORD` | Yes | Admin login password (use 12+ strong characters) |
| `SESSION_SECRET` | Yes | HMAC signing key for sessions (min 32 chars, separate from password) |
| `UPLOADTHING_SECRET` | Yes | Uploadthing secret key (`sk_…`) |
| `UPLOADTHING_APP_ID` | Yes | Uploadthing app ID |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical public URL for sitemap, OG tags, metadata |
| `CAL_COM_URL` | No | Cal.com booking URL — hides "Book a call" when unset |
| `NEXT_PUBLIC_CAL_COM_URL` | No | Client-side Cal.com link (usually same as `CAL_COM_URL`) |

Copy `.env.example` to `.env` and fill in all required values. Production builds fail if required variables are missing.

## Deploy to Vercel

### 1. Neon database

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string (recommended for serverless).
3. Enable connection pooling if not already active.

### 2. Uploadthing

1. Create an app at [uploadthing.com](https://uploadthing.com).
2. Copy `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.

### 3. Vercel project

1. Import the GitHub repository in [Vercel](https://vercel.com).
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `pnpm build` (default).
4. Install command: `pnpm install`.
5. Add all environment variables from the table above.
6. For first deploy, set `NEXT_PUBLIC_SITE_URL` to your Vercel URL, e.g. `https://resurexi-portfolio.vercel.app`.

### 4. Apply database schema (one-time)

After setting `DATABASE_URL` in Vercel, run schema push from your machine against the production database:

```bash
DATABASE_URL="postgresql://..." pnpm db:push
```

No seed data is included — all content is entered through the admin panel.

### 5. Redeploy

Trigger a redeploy after env vars are set. Vercel auto-deploys on push to the connected branch (optional GitHub integration).

## Post-deploy content guide

After the first successful deploy:

1. Log in at `/admin` with your `ADMIN_PASSWORD`.
2. **Content → Hero:** title, subtitle, upload GIF + wireframe layers.
3. **Content → About Preview:** teaser text and preview image.
4. **Content → Contact Info:** email, response time, based in.
5. **Contact links:** add WhatsApp, Telegram, and social links with icons.
6. **Work → Categories:** create categories (e.g. Stills, Animation).
7. **Work:** create at least 3 works, upload covers, mark as featured, set `hidden=false`.
8. **Blog:** create the main About article (`isMain=true`, `hidden=false`).
9. Set `CAL_COM_URL` and `NEXT_PUBLIC_CAL_COM_URL` in Vercel env vars and redeploy to enable booking.

## Domain setup

When a custom domain is purchased:

1. Add the domain in Vercel project settings → Domains.
2. Update DNS records as instructed by Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://resurexi.com`).
4. Redeploy so sitemap, OG tags, and canonical URLs use the new domain.

## Production smoke test

After deploy and content setup, verify:

- [ ] Homepage loads all sections (Hero, Featured Work, About, Contact)
- [ ] `/work` gallery displays works
- [ ] `/admin` login works with `ADMIN_PASSWORD`
- [ ] Image upload works in admin (Uploadthing)
- [ ] Contact form submission appears in Admin → Requests
- [ ] `/sitemap.xml` is accessible and lists public pages
- [ ] Dark/light theme toggle works
- [ ] Cal.com modal opens (if `CAL_COM_URL` is configured)

## Security

- Use a strong, unique `ADMIN_PASSWORD` (12+ characters; never reuse from other services).
- `SESSION_SECRET` must be separate from the admin password and at least 32 characters.
- Admin sessions use httpOnly, secure cookies in production.
- `/admin` is excluded from `sitemap.xml` and blocked in `robots.txt`.
- Server secrets (`ADMIN_PASSWORD`, `SESSION_SECRET`, `UPLOADTHING_SECRET`, `DATABASE_URL`) are never exposed to the client bundle.

## Free tier notes

| Service | Limitation |
|---------|------------|
| **Vercel** | Hobby tier: bandwidth and build minutes limits; sufficient for portfolio traffic |
| **Neon** | Free tier databases sleep after inactivity — first request may have a cold start (~1–2 s) |
| **Uploadthing** | Free tier storage and bandwidth limits — monitor usage in dashboard |

## Project structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (public + admin)
├── server/        # tRPC routers, auth, Drizzle schema
├── lib/           # Shared utilities (SEO, slugs, etc.)
└── styles/        # Global CSS
```

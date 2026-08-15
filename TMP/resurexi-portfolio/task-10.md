# Task 10: Hero-секция

## Описание

Реализовать Hero-сегмент главной страницы: полноэкранный анимированный GIF-фон, текстовый блок с описанием resurexi как 3D designer, ссылки на WhatsApp/Telegram (из contact_links admin), CTA Cal.com, wireframe dual-layer иллюстрация с интерактивным эффектом раскрашивания. Данные из site_content через tRPC.

## Предусловия

**Зависимости:**

- Task 05 — design system
- Task 06 — WaveDivider (optional bottom if next segment colored)
- Task 08 — Cal.com modal
- Task 03 — content.getHero, contact.getLinks

## Компоненты для ориентира

**polygoniq.com** (`polygoniq.png`)

- Full-width hero image/GIF background
- Large headline overlay bottom-left
- Below: wireframe B&W illustration with color layer revealed by cursor position

**YNG.CGI** (`Fullpage YNG.png`)

- Text block structure: overline, headline, subline, dual CTAs
- Contact shortcuts (WhatsApp, Telegram icons)

## План выполнения

### Шаг 1: Hero layout

**Файл:** `src/components/sections/Hero.tsx`

**Структура:**

- Section id="hero", min-h-screen relative
- Background layer: `<img>` or `<video>` GIF (from heroGifUrl), object-cover, absolute inset-0
- Gradient overlay for text readability
- Content container: overline, title, subtitle from site_content
- Contact icon links (filter contact_links where url contains wa.me / t.me or label)
- Buttons: Book a call (Cal.com), optional secondary

### Шаг 2: Wireframe dual-layer effect

**Файл:** `src/components/sections/HeroWireframe.tsx`

**Что делать:**

- Container below main hero text area (or overlapping bottom like polygoniq)
- Two stacked images same dimensions:
  - Bottom: heroWireframeUrl (B&W wireframe)
  - Top: heroWireframeColorUrl (color version), opacity controlled
- Desktop: on mousemove in Hero section — opacity = f(cursorY / heroHeight)
  - Top of hero → opacity 0 (only wireframe visible)
  - Bottom of hero → opacity 1 (full color)
  - Linear or eased mapping
- Mobile: opacity = scrollProgress of entire page
  - scrollProgress = scrollY / (document.documentHeight - window.innerHeight)
  - useEffect + scroll listener with passive, rAF throttle

### Шаг 3: Data fetching

**Что делать:**

- Server component wrapper fetches content.getHero
- Pass to client HeroWireframe for interactivity
- Placeholder content if DB empty (placeholder GIF URL static in public/)

### Шаг 4: Placeholder assets

**Что делать:**

- Add placeholder GIF and wireframe images to `public/placeholders/` for dev
- Document in admin that real assets uploaded via Content section

## Граничные случаи

- Missing GIF URL — solid gradient fallback
- Missing wireframe URLs — hide wireframe block
- prefers-reduced-motion — show color layer at 50% or static
- Touch devices — scroll-based only, no mousemove

## Критерии приёмки

- [ ] Fullscreen GIF background with overlay text
- [ ] Wireframe B&W + color layers aligned pixel-perfect
- [ ] Desktop: opacity follows cursor Y within Hero
- [ ] Mobile: opacity follows page scroll progress 0→1
- [ ] WhatsApp/Telegram links from DB
- [ ] Book a call opens Cal.com modal
- [ ] Content editable via site_content (display works when populated)
- [ ] Placeholder assets for empty state
- [ ] section id="hero" for nav scroll

## Дополнительные заметки

**Важно:**

- GIF is Hero background, NOT header (per clarifications)
- English UI text

**Не делай:**

- Don't implement admin editing — Task 25

# Task 07: Header и навигация

## Описание

Фиксированный header с логотипом resurexi, навигационными ссылками (smooth scroll к сегментам на главной, обычные ссылки на /work и /about), CTA-кнопкой букинга (открывает Cal.com modal), переключателем темы. Прозрачный/over hero на главной, solid при scroll.

## Предусловия

**Зависимости:**

- Task 05 — UI primitives, theme
- Task 08 — Cal.com modal (можно stub onClick если 08 параллельно)

## Компоненты для ориентира

**YNG.CGI** (`Fullpage YNG.png`, `work.png`)

- Logo слева: «YNG.CGI» bold sans
- Nav center-right: Work, About, Contact (у resurexi: Work, About, Contact + scroll Home sections)
- CTA справа: orange pill «Start a Project» → у нас «Book a call» или «Get in touch»
- Fixed position, backdrop on scroll

## План выполнения

### Шаг 1: Header component

**Файл:** `src/components/layout/Header.tsx`

**Структура:**

- Logo / wordmark «resurexi» — Link to /
- Nav links:
  - On `/`: anchor links #featured-work, #about, #contact (+ #hero implicit via logo)
  - On other pages: Link to /#featured-work etc.
  - Work → /work
  - About → /about
- CTA button → opens CalComModal
- ThemeToggle

### Шаг 2: Smooth scroll

**Что делать:**

- `scroll-behavior: smooth` в CSS или JS scrollIntoView
- Offset для fixed header height (scroll-margin-top на section ids)
- Section ids: `hero`, `featured-work`, `about`, `contact`

### Шаг 3: Scroll state styling

**Что делать:**

- useScroll hook или intersection — при scrollY > 50:
  - background: bg-background/80 backdrop-blur
  - border-bottom subtle
- На hero: transparent background, light text if hero dark (depends on GIF)

### Шаг 4: Mobile navigation

**Что делать:**

- Hamburger menu below md breakpoint
- Slide-out or dropdown with same links
- CTA visible in mobile menu

### Шаг 5: Active state

**Что делать:**

- На /work — underline/active Work link (как work.png orange underline)
- На /about — active About
- IntersectionObserver на главной — highlight current section in nav (optional enhancement)

## Граничные случаи

- Deep link /#contact — scroll to section on load
- Keyboard navigation — focusable menu items
- Cal.com modal not ready — button disabled or console warn

## Критерии приёмки

- [ ] Header fixed на всех страницах
- [ ] Smooth scroll к сегментам на главной с header offset
- [ ] Links на /work, /about работают
- [ ] CTA открывает Cal.com modal
- [ ] Theme toggle работает
- [ ] Mobile hamburger menu
- [ ] Visual style aligned with YNG reference (clean, orange CTA)
- [ ] Active state на subpages

## Дополнительные заметки

**Не делай:**

- Не добавляй «Services» — нет в концепте resurexi
- Язык UI: English labels (Work, About, Contact, Book a call)

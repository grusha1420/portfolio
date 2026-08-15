# Task 14: Сборка главной страницы

## Описание

Собрать главную страницу `/` из всех секций в правильном порядке с чередующимися фонами (default → accent A → default → accent B) и волновыми разделителями. Подключить Header, CalComProvider, все секции.

## Предусловия

**Зависимости:**

- Task 07 — Header
- Task 10 — Hero
- Task 11 — FeaturedWork
- Task 12 — AboutPreview
- Task 13 — ContactSection

## План выполнения

### Шаг 1: Page layout

**Файл:** `src/app/page.tsx`

**Порядок секций:**

1. Header (in layout.tsx globally)
2. Hero — default/transparent bg (GIF is background)
3. FeaturedWork — accent segment A + waves
4. AboutPreview — **default bg** (общий фон)
5. ContactSection — **accent segment B + waves** (`variant='home'`)

**Что делать:**

- Wrap page in main element
- Each section proper semantic `<section>`
- scroll-margin-top for anchor links

### Шаг 2: Root layout updates

**Файл:** `src/app/layout.tsx`

**Что делать:**

- Header
- CalComProvider
- ThemeProvider (from Task 05)
- tRPC provider
- Font setup
- metadata base for site

### Шаг 3: Background alternation

**Что делать:**

- Document pattern (по `концепт.md`):
  - Hero: special (GIF, default overlay)
  - Featured: --segment-accent-a + waves
  - About: --background (default, общий)
  - Contact: --segment-accent-b + waves (`variant='home'`)
- ColoredSegment + WaveDivider только для Featured (A) и Contact (B)

### Шаг 4: Footer consideration

**Что делать:**

- No separate footer per concept — Contact section IS the bottom
- Optional minimal copyright line inside Contact or below — not required in concept

### Шаг 5: Visual QA

**Что делать:**

- Compare full page scroll to Fullpage Kenney.png (waves) + Fullpage YNG.png (sections)
- Check dark mode all segments
- Test all header anchor links

## Граничные случаи

- Empty DB — all sections show placeholders gracefully
- Very long page — performance OK with lazy images

## Критерии приёмки

- [ ] All 4 sections render in order on /
- [ ] Background pattern: default → A → default → B (по концепту)
- [ ] Header navigation scrolls to correct sections
- [ ] No visual gaps between segments and waves
- [ ] Dark/light theme works across full page
- [ ] Cal.com accessible from Hero and Contact
- [ ] Page metadata: title «resurexi — 3D Designer» or similar

## Дополнительные заметки

**Не делай:**

- Don't build subpages here

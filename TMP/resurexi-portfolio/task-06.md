# Task 06: Компонент волнового разделителя (WaveDivider)

## Описание

Создать переиспользуемый компонент WaveDivider, воспроизводящий органические волнообразные переходы между сегментами страницы как на kenney.nl. Два варианта: верхняя волна (transition into colored segment) и нижняя волна (transition out). Поддержка разных цветов через props/CSS variables. Анимация — subtle motion как на референсе.

## Предусловия

**Зависимости:**

- Task 05 — CSS variables, theme colors

## Компоненты для ориентира

**Kenney.nl** (`Fullpage Kenney.png`)

- Между белым фоном и фиолетовым/оранжевым блоками — плавные SVG-волны
- Волна «врезается» в цветной блок сверху и снизу
- Не простая sine wave — organic bezier curves
- На Kenney волны могут быть slightly animated (gentle movement)

## План выполнения

### Шаг 1: Анализ референса

**Что делать:**

- Открыть kenney.nl в браузере, inspect SVG wave elements
- Определить: inline SVG vs background, viewBox, path structure
- Зафиксировать approach: SVG `<path>` с cubic bezier, fill = color соседнего сегмента

### Шаг 2: WaveDivider component

**Файл:** `src/components/layout/WaveDivider.tsx`

**Props:**

```typescript
type WaveDividerProps = {
  position: "top" | "bottom";
  fillColor: string; // CSS variable or hex — color of segment this wave belongs to
  backgroundColor?: string; // adjacent segment color (for seamless blend)
  animated?: boolean; // default true
  className?: string;
};
```

**Что делать:**

- SVG занимает full width, height ~60-120px responsive
- position top: волна «выступает» вверх из цветного блока
- position bottom: волна «выступает» вниз
- preserveAspectRatio="none" для stretch на mobile
- flip transform для bottom variant

### Шаг 3: Анимация

**Что делать:**

- CSS `@keyframes` или SMIL для gentle horizontal/vertical morph
- Альтернатива: два path layers с opacity crossfade
- Performance: prefer CSS transform/opacity, will-change на SVG group
- `prefers-reduced-motion: reduce` — статичная волна

### Шаг 4: Theme support

**Что делать:**

- fillColor принимает `var(--segment-accent-a-bg)` etc.
- В dark mode те же variables меняются — волны автоматически адаптируются

### Шаг 5: SegmentWrapper helper (optional)

**Файл:** `src/components/layout/ColoredSegment.tsx`

**Что делать:**

- Обёртка: WaveDivider top + children + WaveDivider bottom
- Props: variant 'a' | 'b' | 'default' — maps to CSS variables
- Упрощает использование в Task 14

## Граничные случаи

- Mobile narrow screens — wave не должна ломаться или показывать gaps (1px seam fix: overlap)
- SSR — SVG inline, no hydration issues
- Very wide screens (4K) — no pixelation (vector handles)

## Критерии приёмки

- [ ] WaveDivider top/bottom рендерятся без visual gaps между сегментами
- [ ] Органическая форма волны соответствует референсу Kenney (не triangle/zigzag)
- [ ] Анимация subtle и работает
- [ ] prefers-reduced-motion отключает анимацию
- [ ] fillColor настраивается через CSS variables
- [ ] Responsive full-width на всех breakpoints
- [ ] Нет ошибок линтера

## Дополнительные заметки

**Важно:**

- «Без упрощений» из уточнений — не заменять на CSS border-radius или простой clip-path polygon
- Если Kenney использует multiple layered waves — воспроизвести layering

**Не делай:**

- Не интегрируй в страницы — только компонент + Story/test page optional

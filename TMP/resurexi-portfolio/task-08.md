# Task 08: Cal.com popup-модал

## Описание

Переиспользуемый popup-модал для Cal.com embed — как на yunusgezginci.com: затемнённый backdrop, embed по центру, кнопка закрытия (×), закрытие по Escape и клику на backdrop. Используется в Hero, Contact-секции и Header CTA.

## Предусловия

**Зависимости:**

- Task 05 — Modal UI primitive

## Компоненты для ориентира

**YNG.CGI Cal.com popup**

- Full viewport dark overlay (~80% opacity black)
- White/light rounded panel centered with Cal.com iframe
- × button top-right of panel or overlay
- Body scroll locked when open

## План выполнения

### Шаг 1: CalComModal component

**Файл:** `src/components/CalComModal.tsx`

**API:**

```typescript
// Context + hook pattern for global open/close
CalComProvider — wraps app in layout
useCalCom() — { open, close, isOpen }
```

**Alternative:** simple component with isOpen/onClose props + global state in zustand/context.

### Шаг 2: Embed integration

**Что делать:**

- `@calcom/embed-react` — `<Cal calLink="..." />` 
- calLink from env NEXT_PUBLIC_CAL_COM_URL or parse from CAL_COM_URL
- Load embed script on first open (lazy) for performance
- Min height ~600px, max-width ~900px responsive

### Шаг 3: Modal UX

**Что делать:**

- Backdrop click → close
- Escape key → close
- Focus trap inside modal (optional but good)
- `document.body.style.overflow = 'hidden'` when open
- Animate fade in/out (opacity transition)

### Шаг 4: Trigger buttons

**Компонент:** `BookCallButton` — wraps Button, calls useCalCom().open()

**Использование:** Hero, Contact, Header — один и тот же паттерн

## Граничные случаи

- CAL_COM_URL not set — hide Book call buttons or show toast «Coming soon»
- iframe blocked — graceful message
- Mobile — full width modal with padding

## Критерии приёмки

- [ ] Modal opens from any Book call / Get in touch trigger
- [ ] Cal.com embed loads and is interactive
- [ ] Close via ×, backdrop, Escape
- [ ] Body scroll locked when open
- [ ] Backdrop darkened like YNG reference
- [ ] Works on mobile
- [ ] Env-based cal link configuration

## Дополнительные заметки

**Не делай:**

- Не дублируй modal logic in each section — single provider

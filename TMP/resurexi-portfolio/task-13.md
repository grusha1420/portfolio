# Task 13: Contact-секция и форма

## Описание

Полноценная Contact-секция: форма связи (имя*, компания, email*, телефон, сообщение), информационная панель справа (как contact.png), ссылки на соцсети и мессенджеры из админки, кнопка Book a call. Отправка формы → запись в contact_requests через tRPC. **Этот же компонент** используется внизу всех дополнительных страниц.

## Предусловия

**Зависимости:**

- Task 03 — contact.submitRequest, contact.getLinks, **content.getContactInfo**
- Task 05 — form UI
- Task 06 — WaveDivider (if on colored segment)
- Task 08 — Cal.com

## Компоненты для ориентира

**contact.png / YNG Contact**

- Two columns: form left, info card right
- Form fields with labels, required *
- Orange «Send →» submit button
- Right card: EMAIL, RESPONSE TIME, BASED IN sections + «Book a call» button
- resurexi: social links grid instead of fixed fields — dynamic from admin

## План выполнения

### Шаг 1: ContactSection component

**Файл:** `src/components/sections/ContactSection.tsx`

**Props:**

```typescript
{ variant?: 'home' | 'page' } // home = accent B + waves на главной; page = default bg на subpages
```

**Layout:**

- id="contact"
- Grid lg:2 cols
- Left: ContactForm
- Right: ContactInfo + SocialLinks + BookCallButton

### Шаг 2: ContactForm

**Файл:** `src/components/sections/ContactForm.tsx`

**Fields (from clarifications):**

- Name* (required)
- Company (optional)
- Email* (required)
- Phone (optional)
- Message* (required) — textarea

**Behavior:**

- Client-side Zod validation matching server
- Submit via contact.submitRequest mutation
- Success: clear form + inline success message «Message sent»
- Error: inline error
- Loading state on button

### Шаг 3: SocialLinks

**Файл:** `src/components/sections/SocialLinks.tsx`

**Что делать:**

- Fetch contact.getLinks
- Render each as icon + label link
- Icon: custom iconUrl or Lucide `Link` fallback
- Include WhatsApp, Telegram, social media — all from admin

### Шаг 4: ContactInfo panel

**Что делать:**

- Fetch **content.getContactInfo** (Task 03)
- Поля из site_content key='contact_info':
  - contactEmail (отображается как EMAIL)
  - responseTimeText (напр. «I respond within 24 hours.»)
  - basedInText (напр. «Working worldwide.»)
- Редактируется в админке Content → tab **Contact Info** (Task 25)
- Fallback placeholder если поля пусты

### Шаг 5: Segment styling (variant)

**Что делать:**

- **`variant='home'`** (главная `/`): ColoredSegment **accent B** + WaveDivider top/bottom — последний цветной сегмент по концепту
- **`variant='page'`** (subpages): default `--background`, без волн — тот же контент, нейтральный фон

### Шаг 6: Reusable export

**Что делать:**

- Export ContactSection for use on subpages with **`variant='page'`**; on `/` use **`variant='home'`**
- Full section, NOT simplified footer (per clarifications)

## Граничные случаи

- Empty contact_links — hide social grid
- Double submit — disable button while pending
- No spam protection needed
- No email notifications

## Критерии приёмки

- [ ] Form validates and submits to DB
- [ ] Required fields enforced client + server
- [ ] Success/error states shown
- [ ] Social links from admin with Link icon fallback
- [ ] Book a call opens Cal.com modal
- [ ] Layout matches contact.png two-column reference
- [ ] On homepage: accent B segment with waves (`variant='home'`)
- [ ] On subpages: default bg (`variant='page'`)
- [ ] Component exported for reuse on subpages
- [ ] English labels

## Дополнительные заметки

**Не делай:**

- project type / budget dropdowns from YNG screenshot — NOT in resurexi clarifications
- Email notifications

# Dining Page Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, dynamic dining page with 6 admin-editable sections (Hero, Philosophy, Menus, Venues, Events, Bar) using global theme typography with optional per-section overrides. All content and media managed via admin panel.

**Architecture:** Extend existing `DiningPageSettings` type to add 4 new sections. Each section follows existing pattern: visibility toggle, content fields, media uploads, optional typography overrides. Admin UI adds new section cards with accordion typography controls. Frontend components consume settings via existing CSS variable system (`--theme-heading-size`, `--theme-body-size`, font classes).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Prisma, Tailwind CSS, Framer Motion, shadcn/ui, Sonner toasts, existing `/api/upload` for media.

## Global Constraints

- **No static data anywhere** — all content from database via `DiningPageSettings`
- **No hardcoded fonts/sizes** — use CSS variables: `var(--theme-heading-size)`, `var(--theme-body-size)`, font classes from `theme.headingFontFamily`, `theme.fontFamily`
- **Typography overrides optional** — Tailwind class strings (e.g., `text-4xl md:text-6xl`), empty = inherit global
- **Media upload only via `/api/upload`** — stores to `/public/uploads`, returns `/uploads/filename`
- **Admin UI only in `/admin/(dashboard)/pages/dining/`** — do not touch other admin pages
- **Frontend only in `/src/components/dining/` and `/dining` page** — do not touch other pages
- **Follow existing patterns** — mirror `HomepageSettings` structure, `DiningEditor`/`VenueManager` patterns

---

## File Map

| File | Purpose |
|------|---------|
| `src/components/dining/types.ts` | Extended `DiningPageSettings` with 4 new sections + typography overrides |
| `src/app/actions/dining-page-settings.ts` | Updated load/save with new sections |
| `src/app/admin/(dashboard)/pages/dining/DiningEditor.tsx` | Added 4 new section editors with typography accordions |
| `src/app/admin/(dashboard)/pages/dining/VenueManager.tsx` | (Existing) Venue CRUD — no changes needed |
| `src/app/admin/(dashboard)/pages/dining/MenuManager.tsx` | **New** — CRUD for menu categories/items per venue |
| `src/app/admin/(dashboard)/pages/dining/EventManager.tsx` | **New** — CRUD for events/private dining |
| `src/components/dining/DiningPhilosophy.tsx` | **New** — Philosophy section with stats + media |
| `src/components/dining/DiningMenus.tsx` | **New** — Tabbed menus by venue/meal |
| `src/components/dining/DiningEvents.tsx` | **New** — Events grid with filtering |
| `src/components/dining/DiningBar.tsx` | **New** — Bar/lounge with cocktail cards |
| `src/app/dining/page.tsx` | Updated to render all 6 sections in order |

---

### Task 1: Extend Dining Types with New Sections + Typography

**Files:**
- Modify: `src/components/dining/types.ts`

**Interfaces:**
- Consumes: Existing `DiningPageSettings`, `BaseSectionSettings`, `DiningVenue`
- Produces: Extended types for Philosophy, Menus, Events, Bar sections

- [ ] **Step 1: Add typography override interface**

```typescript
export interface TypographyOverrides {
  titleSize?: string;
  subtitleSize?: string;
  bodySize?: string;
  captionSize?: string;
  nameSize?: string;
  detailsSize?: string;
  priceSize?: string;
  categorySize?: string;
  statSize?: string;
  metaSize?: string;
}
```

- [ ] **Step 2: Add Philosophy section type**

```typescript
export interface PhilosophySection extends BaseSectionSettings {
  title: string;
  description: string;
  image?: string | null;
  videoUrl?: string | null;
  stats: PhilosophyStat[];
  typography?: TypographyOverrides;
}

export interface PhilosophyStat {
  id: string;
  label: string;
  value: string;
}
```

- [ ] **Step 3: Add Menus section type**

```typescript
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price?: string;
  dietaryTags?: string[];
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuSection extends BaseSectionSettings {
  title: string;
  description: string;
  categories: MenuCategory[];
  typography?: TypographyOverrides;
}
```

- [ ] **Step 4: Add Events section type**

```typescript
export interface DiningEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string | null;
  type: 'live-music' | 'wine-dinner' | 'private-dining' | 'tasting' | 'other';
  capacity?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface EventsSection extends BaseSectionSettings {
  title: string;
  description: string;
  events: DiningEvent[];
  typography?: TypographyOverrides;
}
```

- [ ] **Step 5: Add Bar section type**

```typescript
export interface Cocktail {
  id: string;
  name: string;
  description: string;
  price?: string;
  image?: string | null;
}

export interface BarSection extends BaseSectionSettings {
  title: string;
  description: string;
  image?: string | null;
  videoUrl?: string | null;
  happyHour?: string;
  cocktails: Cocktail[];
  typography?: TypographyOverrides;
}
```

- [ ] **Step 6: Extend DiningPageSettings**

```typescript
export interface DiningPageSettings {
  hero: BaseSectionSettings & { ... };
  intro: BaseSectionSettings & { ... };
  restaurantsList: BaseSectionSettings & { ... };
  philosophy: PhilosophySection;
  menus: MenuSection;
  events: EventsSection;
  bar: BarSection;
}
```

- [ ] **Step 7: Add defaults in defaultDiningPageSettings**

```typescript
philosophy: {
  isVisible: true,
  title: 'Our Culinary Philosophy',
  description: '<p>Rooted in tradition, driven by seasonality.</p>',
  image: null,
  videoUrl: null,
  stats: [
    { id: '1', label: 'Local Ingredients', value: '80%' },
    { id: '2', label: 'Kilometer Radius', value: '50km' },
    { id: '3', label: 'Partner Farms', value: '12' },
  ],
  typography: {},
},
menus: {
  isVisible: true,
  title: 'Our Menus',
  description: 'Explore our seasonal offerings across all venues.',
  categories: [],
  typography: {},
},
events: {
  isVisible: true,
  title: 'Events & Private Dining',
  description: 'Memorable moments crafted for you.',
  events: [],
  typography: {},
},
bar: {
  isVisible: true,
  title: 'The Bar & Lounge',
  description: 'Signature cocktails and curated wines in an intimate setting.',
  image: null,
  videoUrl: null,
  happyHour: 'Daily 16:00–19:00',
  cocktails: [],
  typography: {},
}
```

- [ ] **Step 8: Verify build passes**

Run: `npm run build`

---

### Task 2: Update Dining Page Settings Actions

**Files:**
- Modify: `src/app/actions/dining-page-settings.ts`

**Interfaces:**
- Consumes: Extended `DiningPageSettings`, `defaultDiningPageSettings` from Task 1
- Produces: Updated `getDiningPageSettings`, `updateDiningPageSettings`

- [ ] **Step 1: Update getDiningPageSettings to merge new sections**

```typescript
return {
  hero: { ...defaultDiningPageSettings.hero, ...parsed.hero },
  intro: { ...defaultDiningPageSettings.intro, ...parsed.intro },
  restaurantsList: {
    ...defaultDiningPageSettings.restaurantsList,
    ...parsed.restaurantsList,
    venues: parsed.restaurantsList?.venues || [],
  },
  philosophy: {
    ...defaultDiningPageSettings.philosophy,
    ...parsed.philosophy,
    stats: parsed.philosophy?.stats || [],
    typography: parsed.philosophy?.typography || {},
  },
  menus: {
    ...defaultDiningPageSettings.menus,
    ...parsed.menus,
    categories: parsed.menus?.categories || [],
    typography: parsed.menus?.typography || {},
  },
  events: {
    ...defaultDiningPageSettings.events,
    ...parsed.events,
    events: parsed.events?.events || [],
    typography: parsed.events?.typography || {},
  },
  bar: {
    ...defaultDiningPageSettings.bar,
    ...parsed.bar,
    cocktails: parsed.bar?.cocktails || [],
    typography: parsed.bar?.typography || {},
  },
};
```

- [ ] **Step 2: Verify updateDiningPageSettings works (no changes needed — JSON stringify handles all)**

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 3: Create MenuManager Component

**Files:**
- Create: `src/app/admin/(dashboard)/pages/dining/MenuManager.tsx`

**Interfaces:**
- Consumes: `MenuCategory[]`, `MenuItem[]` from types
- Produces: `onCategoriesChange: (categories: MenuCategory[]) => void`

- [ ] **Step 1: Create component with category/item CRUD**

Features:
- Add/remove/reorder categories
- Add/remove/reorder items within category
- Each item: name, description, price, dietary tags (checkboxes: vegetarian, vegan, gluten-free, dairy-free, nut-free)
- Drag-and-drop reorder (use `dnd-kit` if available, else up/down buttons)
- Image upload per category (optional hero image)

- [ ] **Step 2: Add typography accordion**

```tsx
// Inside MenuManager, collapsible section:
<details className="group border-t pt-4 mt-4">
  <summary className="font-medium cursor-pointer flex items-center gap-2">
    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
    Typography Overrides
  </summary>
  <div className="grid gap-4 mt-4">
    {/* Inputs for categoryTitleSize, itemNameSize, itemDescSize, priceSize */}
  </div>
</details>
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 4: Create EventManager Component

**Files:**
- Create: `src/app/admin/(dashboard)/pages/dining/EventManager.tsx`

**Interfaces:**
- Consumes: `DiningEvent[]` from types
- Produces: `onEventsChange: (events: DiningEvent[]) => void`

- [ ] **Step 1: Create component with event CRUD**

Fields per event:
- Title, Date (date picker), Time, Description (rich text)
- Image upload
- Type select: live-music, wine-dinner, private-dining, tasting, other
- Capacity (optional), CTA Label + URL (optional)
- Visibility toggle per event

- [ ] **Step 2: Add typography accordion** (same pattern as MenuManager)

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 5: Update DiningEditor with 4 New Sections

**Files:**
- Modify: `src/app/admin/(dashboard)/pages/dining/DiningEditor.tsx`

**Interfaces:**
- Consumes: Extended `DiningPageSettings`, new manager components
- Produces: Updated sectionsList, section renderers

- [ ] **Step 1: Import new managers**

```typescript
import { MenuManager } from './MenuManager';
import { EventManager } from './EventManager';
// Philosophy & Bar use inline editors (simpler, like hero/intro)
```

- [ ] **Step 2: Add to sectionsList**

```typescript
const sectionsList = [
  { id: 'hero', title: 'Hero Section', desc: 'Main banner at the top of the page' },
  { id: 'philosophy', title: 'Culinary Philosophy', desc: 'Story, values, ingredient sourcing, stats' },
  { id: 'menus', title: 'Menus', desc: 'Seasonal menus by venue and meal' },
  { id: 'restaurantsList', title: 'Venues List', desc: 'Heading for the list of venues' },
  { id: 'venues', title: 'Manage Venues', desc: 'Add, edit, or remove dining venues' },
  { id: 'events', title: 'Events & Private Dining', desc: 'Live music, wine dinners, private dining' },
  { id: 'bar', title: 'Bar & Lounge', desc: 'Cocktails, happy hour, wine list' },
];
```

- [ ] **Step 3: Add Philosophy editor section** (inline, like hero/intro)

Fields: title, description (rich text), image/video upload, stats array editor (label/value pairs), typography accordion

- [ ] **Step 4: Add Menus section** → renders `<MenuManager />`

- [ ] **Step 5: Add Events section** → renders `<EventManager />`

- [ ] **Step 6: Add Bar editor section** (inline)

Fields: title, description (rich text), image/video upload, happy hour text, cocktails array editor (name, description, price, image), typography accordion

- [ ] **Step 7: Wire onChange for all new sections** to update settings state

- [ ] **Step 8: Verify build passes**

Run: `npm run build`

---

### Task 6: Create DiningPhilosophy Frontend Component

**Files:**
- Create: `src/components/dining/DiningPhilosophy.tsx`

**Interfaces:**
- Consumes: `PhilosophySection` from types
- Produces: React component

- [ ] **Step 1: Create component structure**

```tsx
export function DiningPhilosophy({ settings }: { settings: PhilosophySection }) {
  if (!settings.isVisible) return null;
  const fontClass = settings.typography?.titleSize ? '' : 'var(--theme-heading-size)';
  // Use CSS variables for sizing, apply typography overrides as Tailwind classes when set
}
```

- [ ] **Step 2: Render layout**

- Full-width media (image/video parallax like Hero)
- Centered content: title, description (rich text)
- Stats grid (3 columns): animated counters for value + label
- Apply typography: `className={`${settings.typography?.titleSize || ''} ${settings.theme.headingFontFamily}`}`

- [ ] **Step 3: Handle missing media gracefully** (show placeholder)

- [ ] **Step 4: Verify build passes**

Run: `npm run build`

---

### Task 7: Create DiningMenus Frontend Component

**Files:**
- Create: `src/components/dining/DiningMenus.tsx`

**Interfaces:**
- Consumes: `MenuSection` from types
- Produces: React component

- [ ] **Step 1: Create tabbed interface**

- Tabs = categories (breakfast, lunch, dinner, drinks, etc.)
- Each tab: category title, items list
- Item card: name, description, price, dietary badges
- Empty state: "No menus configured"

- [ ] **Step 2: Apply typography overrides** per element type

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 8: Create DiningEvents Frontend Component

**Files:**
- Create: `src/components/dining/DiningEvents.tsx`

**Interfaces:**
- Consumes: `EventsSection` from types
- Produces: React component

- [ ] **Step 1: Create filterable grid**

- Filter chips: All, Live Music, Wine Dinner, Private Dining, Tasting
- Event cards: image, type badge, title, date/time, description, capacity, CTA button
- Empty state: "No upcoming events"

- [ ] **Step 2: Apply typography overrides**

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 9: Create DiningBar Frontend Component

**Files:**
- Create: `src/components/dining/DiningBar.tsx`

**Interfaces:**
- Consumes: `BarSection` from types
- Produces: React component

- [ ] **Step 1: Create layout**

- Hero media (image/video) + overlay content: title, description, happy hour
- Cocktail grid: image, name, description, price
- Empty state for cocktails

- [ ] **Step 2: Apply typography overrides**

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

---

### Task 10: Update Dining Page to Render All Sections

**Files:**
- Modify: `src/app/dining/page.tsx`

**Interfaces:**
- Consumes: All dining components, `getDiningPageSettings`
- Produces: Complete page

- [ ] **Step 1: Import new components**

```typescript
import { DiningPhilosophy } from '@/components/dining/DiningPhilosophy';
import { DiningMenus } from '@/components/dining/DiningMenus';
import { DiningEvents } from '@/components/dining/DiningEvents';
import { DiningBar } from '@/components/dining/DiningBar';
```

- [ ] **Step 2: Render in order**

```tsx
<DiningHero settings={settings.hero} />
<DiningIntro settings={settings.intro} />
<DiningPhilosophy settings={settings.philosophy} />
<DiningMenus settings={settings.menus} />
<RestaurantsList settings={settings.restaurantsList} />
<DiningEvents settings={settings.events} />
<DiningBar settings={settings.bar} />
```

- [ ] **Step 3: Pass theme context** (font classes, CSS variables already global)

- [ ] **Step 4: Verify build passes**

Run: `npm run build`

---

### Task 11: End-to-End Verification

**Files:** All above

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test admin flow**
  - Navigate to `/admin/pages/dining`
  - Add venue in "Manage Venues" → Save Changes → verify persists on refresh
  - Add philosophy content + stats + image → Save → verify on frontend
  - Add menu category + items → Save → verify on frontend
  - Add event + image → Save → verify on frontend
  - Add cocktail → Save → verify on frontend
  - Toggle visibility on each section → verify hides/shows
  - Test typography overrides: set `titleSize: "text-5xl md:text-7xl"` → verify on frontend

- [ ] **Step 3: Test media uploads**
  - Upload images for all sections
  - Upload video for hero/philosophy/bar
  - Verify files in `/public/uploads`

- [ ] **Step 4: Run build**

Run: `npm run build`

---

## Self-Review Checklist

- [ ] All 6 sections implemented (Hero, Philosophy, Menus, Venues, Events, Bar)
- [ ] All sections have admin editors with media upload
- [ ] All sections have optional typography overrides
- [ ] No hardcoded fonts/sizes — uses CSS variables + font classes
- [ ] No static data — all from database via settings
- [ ] Only dining page and dining admin tab modified
- [ ] Build passes
- [ ] Types consistent across all tasks
# Copilot Instructions for Order App

## Project Overview

**Order App** is a Next.js 14 e-commerce application for ordering Nepali food. It integrates with **MicroCMS** for dynamic menu management and uses **localStorage** for cart persistence. The app supports a complete order flow: menu browsing → cart management → order confirmation → payment.

### Tech Stack

- **Framework**: Next.js 14.2.3 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules (`*.module.css`)
- **CMS**: MicroCMS (headless API)
- **Icons**: react-icons/fa (Font Awesome)
- **Images**: Next.js Image optimization (remote domain: `images.microcms-assets.io`)

---

## Architecture

### Data Flow

1. **Backend**: `app/api/menu/route.ts` - Server-side MicroCMS proxy (fetches with `MICROCMS_API_KEY`)
2. **Frontend**: `app/page.tsx` - Client-side menu display, calls `/api/menu`
3. **Cart**: Stored in `localStorage` with structure `CartItem[]` (MenuItem + quantity)
4. **Order**: Cleared on payment, confirmation stored in localStorage temporarily

### Key Routes

- `/` - Home page with menu and add-to-cart (main component)
- `/cart` - Review cart, modify quantities, proceed to checkout
- `/confirm/[id]` - Order confirmation page (note: `[id]` is not fully utilized yet)
- `/drinks`, `/gallery` - Stub pages (minimal implementation)

### Critical Types

```typescript
// MenuItem from MicroCMS
type MenuItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  image?: { url: string; width: number; height: number };
};

// CartItem extends MenuItem with quantity tracking
type CartItem = MenuItem & { quantity: number };
```

---

## Essential Developer Workflows

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000, auto-reload)
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # TypeScript + ESLint
```

### Environment Setup

- Create `.env.local` with `MICROCMS_API_KEY=your_key` (server-side only, never expose to client)
- The key is used in `app/api/menu/route.ts` only
- `.env.local` must be in `.gitignore` (already configured)

### Deployment to Vercel

```powershell
npm install -g vercel
vercel login
vercel
# Then add MICROCMS_API_KEY in Vercel Project Settings (Production + Preview)
```

---

## Project-Specific Patterns & Conventions

### Client Components

- **"use client"** directive on all interactive pages (`page.tsx` in cart, confirm, home)
- **State**: useState for UI state + cart changes
- **Storage**: Always sync cart to localStorage on state changes
- **Error Handling**: Fetch errors display Japanese error messages (see `page.tsx` line 37-42)

### API Routes

- Single responsibility: `app/api/menu/route.ts` only handles MicroCMS proxying
- Error handling returns `NextResponse.json()` with descriptive messages
- `cache: "no-store"` prevents stale menu data

### Cart Management Pattern

```typescript
// Cart updates ALWAYS follow this pattern:
const updateCart = (next: CartItem[]) => {
  setCart(next);
  localStorage.setItem("cart", JSON.stringify(next));
};

// Modify with functions that calculate new state, pass to updateCart
// Example: changeQty in app/cart/page.tsx (lines 34-42)
```

### Styling Convention

- CSS Modules only (`styles/page.module.css`, imported as `styles`)
- Global CSS: `app/globals.css`
- No Tailwind or inline styles (maintain consistency)

### Image Handling

- Use Next.js `Image` component with remote domains configured
- `next.config.mjs` whitelists `images.microcms-assets.io`
- Provide `width`/`height` from MicroCMS response for layout stability

---

## Cross-Component Communication

### Cart Sharing (localStorage-based)

- Cart is read in `page.tsx` (home), `cart/page.tsx`, and `confirm/[id]/page.tsx`
- No Context API or state management library used
- Each component independently syncs to localStorage

### Order Confirmation Pattern

- After payment, `page.tsx` sets localStorage flags:
  - `orderComplete: "true"` → triggers success banner (lines 59-67)
  - `paidAmount: number` → displays amount paid
  - Flags auto-clear after 3 seconds

---

## Integration Points & External Dependencies

### MicroCMS API

- **Endpoint**: `https://2uo0wskuv5.microcms.io/api/v1/menu`
- **Request**: GET with header `X-API-KEY: ${MICROCMS_API_KEY}`
- **Response Shape**: `{ contents: MenuItem[] }` (see `page.tsx` line 37)
- **Cache Strategy**: `no-store` (real-time menu updates)

### react-icons/fa

- Used for social media icons (Footer in `page.tsx`)
- Icons: `FaFacebook`, `FaInstagram`, `FaEnvelope`

---

## When Adding Features

### Modify Cart Logic

1. Update `CartItem` type if needed
2. Modify cart update functions (e.g., `changeQty`, `removeAt`)
3. Always call `localStorage.setItem()` in sync functions
4. Example: See `cart/page.tsx` lines 34-42 for increment/decrement pattern

### Add New Pages

- Create folder under `/app` (e.g., `/app/orders`)
- Use "use client" if interactive
- Follow CSS Module pattern for styling
- Import types from adjacent files or create `types.ts` if shared

### Extend Menu Features

- MicroCMS response structure defined by their API (expand `MenuItem` type if new fields added)
- All menu data flows through `/api/menu/route.ts` → ensure changes don't break the proxy
- Test locally with `.env.local` key before deploying

### Handle Errors

- **API errors**: Return descriptive `NextResponse.json()` with status codes (see `route.ts`)
- **Fetch errors**: Display Japanese user-facing messages, log details to console (see `page.tsx` line 37-42)
- **Cart issues**: Validate parsed JSON with try-catch (see `cart/page.tsx` line 17-25)

---

## Key Files Quick Reference

| File                        | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `app/page.tsx`              | Menu display, add-to-cart, order success banner                  |
| `app/api/menu/route.ts`     | MicroCMS proxy (server-only)                                     |
| `app/cart/page.tsx`         | Cart review, quantity adjustment, checkout                       |
| `app/confirm/[id]/page.tsx` | Order summary before payment                                     |
| `next.config.mjs`           | Image optimization, MicroCMS domain whitelisting                 |
| `package.json`              | Dependencies (microcms-js-sdk, react-icons installed but unused) |

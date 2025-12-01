# 🎮 Telegram Gaming Platform - Development Plan

> **Project:** Telegram Mini App Gaming Platform  
> **Goal:** Build a beautiful, user-friendly gaming platform monetized through subscriptions and wallet system with FenanPay integration  
> **Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, @telegram-apps/sdk-react, Prisma, PostgreSQL

---

## 📋 Table of Contents

1. [Phase 1: UI/UX Foundation & Game Player Fix](#phase-1-uiux-foundation--game-player-fix)
2. [Phase 2: User Registration & Authentication](#phase-2-user-registration--authentication)
3. [Phase 3: User Profile Management](#phase-3-user-profile-management)
4. [Phase 4: Game Library & Catalog](#phase-4-game-library--catalog)
5. [Phase 5: Database & Backend Setup](#phase-5-database--backend-setup)
6. [Phase 6: Subscription Management](#phase-6-subscription-management)
7. [Phase 7: Wallet System Integration](#phase-7-wallet-system-integration)
8. [Phase 8: FenanPay Payment Gateway Integration](#phase-8-fenanpay-payment-gateway-integration)
9. [Phase 9: Testing & Deployment](#phase-9-testing--deployment)

---

## Phase 1: UI/UX Foundation & Game Player Fix

**Priority: CRITICAL**  
**Timeline: 2-3 days**

### 1.1 Fix Game Player Screen (Fullscreen Issue)

**Problem:** Game iframe is not full width/height, looks small and not user-friendly.

**Files to modify:**
- `src/app/play/[slug]/page.tsx`

**Implementation Steps:**

1. **Update iframe container to use proper viewport handling:**
```tsx
<div style={{ 
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: 'var(--tg-viewport-stable-height, 100vh)'
}}>
```

2. **Add fullscreen mode button using Telegram SDK:**
```tsx
import { requestFullscreen, exitFullscreen } from '@telegram-apps/sdk-react';

const [isFullscreen, setIsFullscreen] = useState(false);

const toggleFullscreen = async () => {
  try {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  } catch (e) {
    console.warn('Fullscreen not supported');
  }
};
```

3. **Handle safe area insets for notched devices:**
```css
padding-top: var(--tg-content-safe-area-inset-top);
padding-bottom: var(--tg-content-safe-area-inset-bottom);
```

4. **Add floating control buttons (Back, Fullscreen):**
   - Position controls at bottom-right with glass-morphism design
   - Use `z-index: 9999` to overlay the game
   - Auto-hide after 3 seconds of inactivity

5. **Gate fullscreen by Telegram version (per `telegram-webapps.md` and `telegram-launch-parameters.md`):**
   - Read `tgWebAppVersion` from launch params on init.
   - Only enable fullscreen toggle if version ≥ 8.0 and `requestFullscreen` method exists.
   - Listen to `fullscreenChanged` and `fullscreenFailed` events to update UI state.
   - Use `--tg-content-safe-area-inset-*` (not just generic safe area) for game surfaces, per the content-safe-area distinction in the docs.

---

### 1.2 Redesign Home Page Layout

**Problem:** Current UI is messy, lacks proper sections and structure.

**Files to modify:**
- `src/app/page.tsx`
- `src/app/_assets/globals.css`

**Create new component structure:**
```
src/components/
├── layout/
│   ├── Header.tsx          # App header with user avatar, notifications
│   ├── Footer.tsx          # Bottom navigation bar
│   └── Container.tsx       # Page container with padding
├── home/
│   ├── HeroSection.tsx     # Welcome banner with CTA
│   ├── GameCard.tsx        # Individual game card component
│   ├── GameGrid.tsx        # Games grid layout
│   └── CategoryTabs.tsx    # Game category filter tabs
└── ui/
    ├── Button.tsx          # Reusable button component
    ├── Card.tsx            # Reusable card component
    ├── Avatar.tsx          # User avatar component
    ├── Badge.tsx           # Status/category badge
    └── Skeleton.tsx        # Loading skeleton
```

**Header Design:**
- Fixed at top with blur backdrop
- Left: User avatar + greeting
- Center: App logo/name
- Right: Notification bell + settings icon
- Height: 56px

**Hero Section Design:**
- Full-width gradient card
- Welcome message personalized with user name
- Daily bonus / streak indicator (future feature)
- "Play Now" CTA button
- Height: ~180px

**Game Grid Design:**
- Section title with "See All" link
- Horizontal scroll for featured games
- 2-column grid for all games
- Each card: thumbnail, title, category badge, play count, "Play" button
- Card aspect ratio: 16:10 for thumbnail

**Footer/Bottom Navigation:**
- Fixed at bottom
- 4 tabs: Home, Games, Wallet, Profile
- Icons with labels
- Active state indicator
- Height: 64px

---

### 1.3 Design System Setup

**Update Tailwind config:**

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        'tg-bg': 'var(--tg-theme-bg-color, #1a1a2e)',
        'tg-secondary': 'var(--tg-theme-secondary-bg-color, #16213e)',
        'tg-text': 'var(--tg-theme-text-color, #ffffff)',
        'tg-hint': 'var(--tg-theme-hint-color, #999999)',
        'tg-link': 'var(--tg-theme-link-color, #3390ec)',
        'tg-button': 'var(--tg-theme-button-color, #3390ec)',
        'tg-button-text': 'var(--tg-theme-button-text-color, #ffffff)',
        'accent': {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        'gaming': {
          purple: '#9333EA',
          pink: '#EC4899',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        }
      }
    }
  }
}
```

### ✅ Phase 1 Acceptance Checklist

- [x] Game player fills entire viewport (no visible gaps or scrollbars)
- [x] `--tg-viewport-stable-height` CSS variable is applied correctly
- [x] `--tg-content-safe-area-inset-*` variables used for game surface padding
- [x] Fullscreen toggle button appears and functions (on supported versions)
- [x] `tgWebAppVersion` is checked before enabling fullscreen features
- [x] `fullscreenChanged` and `fullscreenFailed` events are handled gracefully
- [x] Floating controls auto-hide after 3 seconds of inactivity
- [x] Back button returns user to home page
- [x] Home page has clear header, hero, game grid, and footer sections
- [x] Theme colors from `tgWebAppThemeParams` are applied via CSS variables
- [x] Loading skeleton displays while games are fetching
- [x] Game cards show thumbnail, title, category badge, and play button
- [x] Bottom navigation works (Home, Games, Wallet, Profile tabs)
- [ ] UI renders correctly on iOS, Android, and Desktop Telegram clients *(requires real device testing)*

---

## Phase 2: User Registration & Authentication

**Timeline: 2-3 days**

### 2.1 Fix Current Auth Flow

**Problem:** Auth shows "Checking" then "Failed"

**Root Cause Analysis:**
1. `getInitialHash()` may not capture hash if called too late
2. Launch params may be cleared by SPA routing
3. Bot token validation may fail if token is incorrect

**Files to modify:**
- `src/utils/initDataApi.ts`
- `src/utils/launchParamsCache.ts`
- `src/app/api/auth/validate/route.ts`

**Implementation Steps:**

1. **Enhance hash caching (capture ASAP):**
```typescript
// src/utils/launchParamsCache.ts
let cachedHash: string | null = null;
let cachedInitData: string | null = null;

export function captureInitData(): void {
  if (typeof window === 'undefined') return;
  
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  
  cachedHash = hash;
  cachedInitData = params.get('tgWebAppData');
  
  console.log('[Auth] Captured init data:', !!cachedInitData);
}

export function getCachedInitData(): string | null {
  return cachedInitData;
}
```

2. **Update validation to use cached data:**
```typescript
// src/utils/initDataApi.ts
export async function validateInitData(): Promise<InitDataValidationResult> {
  const initDataRaw = getCachedInitData();
  
  if (!initDataRaw) {
    console.warn('[Auth] No init data found - running outside Telegram?');
    return { valid: false, error: 'not-in-telegram' };
  }
  
  // ... validation logic
}
```

3. **Add detailed error responses from backend:**
```typescript
// src/app/api/auth/validate/route.ts
try {
  validate(authData, process.env.BOT_TOKEN!, { expiresIn: 3600 });
} catch (error) {
  const message = (error as Error).message;
  
  if (message.includes('expired')) {
    return NextResponse.json({ valid: false, error: 'expired' }, { status: 401 });
  }
  if (message.includes('signature')) {
    return NextResponse.json({ valid: false, error: 'invalid-signature' }, { status: 401 });
  }
}
```

4. **Respect Telegram's `auth_date` / `expiresIn` guidance (per `telegram-init-data.md` and `telegram-authorizing-user.md`):**
   - Only derive your own short-lived app tokens from a *recently validated* init data.
   - Never reuse stale raw init strings; if init data is expired, prompt the user to re-launch the Mini App.
   - Your app-level access tokens are **your own tokens** built on top of Telegram's stateless signature mechanism—never embed the bot token or raw init data in them.

---

### 2.2 User Auto-Registration

**On successful validation, create/update user in database.**

**Database schema (Prisma):**
```prisma
model User {
  id            String    @id @default(cuid())
  telegramId    BigInt    @unique
  username      String?
  firstName     String
  lastName      String?
  languageCode  String?
  isPremium     Boolean   @default(false)
  photoUrl      String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime  @default(now())
  
  profile       Profile?
  subscription  Subscription?
  wallet        Wallet?
  gameSessions  GameSession[]
}
```

### ✅ Phase 2 Acceptance Checklist

- [ ] Init data is captured from `window.location.hash` before SPA routing changes it
- [ ] `tgWebAppData` is successfully extracted and cached on app load
- [ ] Auth status shows "Authenticated" when running inside Telegram
- [ ] Auth status shows "Guest Mode" or appropriate message outside Telegram
- [ ] Backend `/api/auth/validate` returns `{ valid: true, user: {...} }` for valid init data
- [ ] Backend returns `{ valid: false, error: 'expired' }` for expired init data (>1 hour old)
- [ ] Backend returns `{ valid: false, error: 'invalid-signature' }` for tampered data
- [ ] User is auto-created in database on first successful validation
- [ ] Existing user's `lastLoginAt` is updated on subsequent logins
- [ ] No bot token or raw init data is exposed to the client or stored long-term
- [ ] App-level access tokens (if used) are short-lived and derived from validated init data only
- [ ] Console logs show clear debug info for auth flow troubleshooting
- [ ] Auth works on Telegram iOS, Android, Desktop, and Web clients

---

## Phase 3: User Profile Management

**Timeline: 2-3 days**

> **Important (per `telegram-init-data.md`):** Profile creation and updates must use data from **validated** `InitData` only. Any additional fields (bio, preferences) come from our own database and are not written back to Telegram. Never trust init data until server-side validation is complete.

### 3.1 Profile Page

**Create:** `src/app/profile/page.tsx`

**Features:**
- User avatar (from Telegram or custom)
- Display name
- Username
- Member since date
- Games played count
- Total playtime
- Subscription status badge
- Wallet balance preview
- Settings link

**Profile Page Sections:**
1. **Header Card:** Avatar, name, premium badge
2. **Stats Grid:** Games played, playtime, high scores
3. **Subscription Card:** Current plan, expiry, upgrade button
4. **Wallet Preview:** Balance, top-up button
5. **Settings List:** Language, notifications, about

---

### 3.2 Profile API Endpoints

```
src/app/api/user/
├── route.ts              # GET current user profile
├── update/route.ts       # PATCH update profile
└── stats/route.ts        # GET user statistics
```

**Database schema addition:**
```prisma
model Profile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  
  displayName   String?
  bio           String?
  customAvatar  String?
  
  totalGamesPlayed    Int      @default(0)
  totalPlaytimeMinutes Int     @default(0)
  favoriteCategory    String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### ✅ Phase 3 Acceptance Checklist

- [ ] Profile page displays user avatar from Telegram (or placeholder)
- [ ] Display name, username, and "Member since" date are shown
- [ ] Games played count and total playtime are accurate
- [ ] Subscription status badge displays current plan (Free/Basic/Premium/VIP)
- [ ] Wallet balance preview shows correct amount
- [ ] Settings link navigates to settings page/modal
- [ ] `/api/user` returns current user profile data
- [ ] `/api/user/update` allows updating display name and bio
- [ ] `/api/user/stats` returns accurate game statistics
- [ ] Profile data is sourced only from validated init data (for Telegram fields)
- [ ] Custom fields (bio, preferences) are stored in our database, not sent to Telegram
- [ ] Profile page loads within 2 seconds
- [ ] Profile displays correctly across all Telegram client platforms

---

## Phase 4: Game Library & Catalog

**Timeline: 3-4 days**

> **Deep Linking (per `telegram-start-parameter.md` and `telegram-launch-parameters.md`):**
> - Use `tgWebAppStartParam` (from launch params) and `initData.start_param` for deep linking to specific games, categories, or referral codes.
> - Cross-check both values for integrity as recommended in the docs.
> - Treat start parameters as **untrusted until server-side validation** (e.g., verifying user permissions, resolving referral codes).
> - Example: `https://t.me/mybot/myapp?startapp=game_asteroid` → app reads `startParam = 'game_asteroid'` → auto-navigates to that game.

### 4.1 Enhanced Games Page

**Create:** `src/app/games/page.tsx`

**Features:**
- Search bar with instant search
- Category filter tabs (Arcade, Puzzle, Action, etc.)
- Sort options (Popular, New, A-Z)
- Grid/List view toggle
- Game cards with:
  - Thumbnail
  - Title
  - Category badge
  - Rating stars
  - Play count
  - Premium indicator (if locked)
  - Quick play button

---

### 4.2 Game Detail Page

**Create:** `src/app/games/[slug]/page.tsx`

**Features:**
- Large hero image/video preview
- Game title and category
- Description
- How to play instructions
- Screenshots carousel
- Rating and reviews
- Play count
- "Play Now" button (large, prominent)
- Share button
- Add to favorites

---

### 4.3 Enhanced Game Player

**Update:** `src/app/play/[slug]/page.tsx`

**Complete rewrite with fullscreen support:**

```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  backButton, 
  requestFullscreen, 
  exitFullscreen 
} from '@telegram-apps/sdk-react';

export default function GamePlayer() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);
  
  const handleTap = () => setShowControls(true);
  
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    } catch (e) {
      console.warn('Fullscreen not supported');
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black"
      onClick={handleTap}
      style={{
        width: '100vw',
        height: 'var(--tg-viewport-stable-height, 100vh)',
      }}
    >
      {/* Loading overlay */}
      {!gameLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white">Loading game...</p>
          </div>
        </div>
      )}
      
      {/* Game iframe - TRUE fullscreen */}
      <iframe
        src={`/games/${slug}/index.html`}
        className="w-full h-full border-0"
        style={{ width: '100%', height: '100%', display: 'block' }}
        onLoad={() => setGameLoaded(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
        allowFullScreen
      />
      
      {/* Floating controls */}
      {showControls && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-lg flex items-center justify-center text-white"
          >
            {isFullscreen ? '⊙' : '⛶'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); router.push('/'); }}
            className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-lg flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### 4.4 Games API Enhancement

**Update:** `src/app/api/games/route.ts`

**Add features:**
- Pagination
- Category filtering
- Search
- Sort options
- Play count tracking

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'popular';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // Load and filter games...
}
```

### ✅ Phase 4 Acceptance Checklist

- [ ] Games catalog page displays all available games
- [ ] Search bar filters games by title in real-time
- [ ] Category tabs filter games correctly (Arcade, Puzzle, Action, etc.)
- [ ] Sort options work (Popular, New, A-Z)
- [ ] Grid/List view toggle functions correctly
- [ ] Premium games show lock indicator for free users
- [ ] Game detail page shows hero image, description, instructions, and screenshots
- [ ] "Play Now" button launches game player
- [ ] Share button generates shareable link
- [ ] Deep linking via `tgWebAppStartParam` navigates to correct game
- [ ] `initData.start_param` is cross-checked with launch param for integrity
- [ ] Start parameters are validated server-side before granting access
- [ ] `/api/games` supports pagination, filtering, and search parameters
- [ ] Play count increments when a game session starts
- [ ] Game player loads within 3 seconds
- [ ] All 5 initial games (asteroid, hunting-frog, mini-racer, ninja-leap, ski-drift) are playable

---

## Phase 5: Database & Backend Setup

**Timeline: 2-3 days**

### 5.1 Database Setup

**Install dependencies:**
```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
npx prisma init
```

**Complete Prisma Schema:**
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NOTE (per telegram-init-data.md): 
// - `telegramId` is the int64 user ID from validated InitData.user.id
// - Never store raw init data or bot token in the database
// - Profile snapshot (username, firstName, etc.) comes from validated init data only

model User {
  id            String    @id @default(cuid())
  telegramId    BigInt    @unique  // From validated InitData.user.id
  username      String?
  firstName     String
  lastName      String?
  languageCode  String?
  isPremium     Boolean   @default(false)
  photoUrl      String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime  @default(now())
  
  profile       Profile?
  subscription  Subscription?
  wallet        Wallet?
  transactions  Transaction[]
  gameSessions  GameSession[]
}

model Profile {
  id                   String   @id @default(cuid())
  userId               String   @unique
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  displayName          String?
  bio                  String?
  customAvatar         String?
  totalGamesPlayed     Int      @default(0)
  totalPlaytimeMinutes Int      @default(0)
  
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model Game {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  instructions String
  category    String
  tags        String[]
  thumbnail   String
  
  isPremium   Boolean  @default(false)
  playCount   Int      @default(0)
  rating      Float    @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  sessions    GameSession[]
}

model GameSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  gameId    String
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  
  startedAt DateTime @default(now())
  endedAt   DateTime?
  duration  Int?
  score     Int?
  
  @@index([userId])
  @@index([gameId])
}

model Subscription {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  plan         SubscriptionPlan @default(FREE)
  status       SubscriptionStatus @default(ACTIVE)
  
  startDate    DateTime @default(now())
  endDate      DateTime?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum SubscriptionPlan {
  FREE
  BASIC
  PREMIUM
  VIP
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING
}

model Wallet {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  balance      Decimal  @default(0) @db.Decimal(10, 2)
  currency     String   @default("ETB")
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  transactions Transaction[]
}

model Transaction {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  walletId      String
  wallet        Wallet   @relation(fields: [walletId], references: [id], onDelete: Cascade)
  
  type          TransactionType
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("ETB")
  
  status        TransactionStatus @default(PENDING)
  
  reference     String?  @unique
  description   String?
  metadata      Json?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([walletId])
  @@index([reference])
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  SUBSCRIPTION
  REFUND
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}
```

---

### 5.2 Database Client Setup

**Create:** `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### ✅ Phase 5 Acceptance Checklist

- [ ] PostgreSQL database is provisioned and accessible
- [ ] `DATABASE_URL` environment variable is configured
- [ ] Prisma schema compiles without errors (`npx prisma validate`)
- [ ] Migrations run successfully (`npx prisma migrate dev`)
- [ ] All models are created: User, Profile, Game, GameSession, Subscription, Wallet, Transaction
- [ ] `telegramId` is stored as BigInt and indexed
- [ ] No raw init data or bot token is stored in any table
- [ ] Prisma Client is generated and importable (`src/lib/prisma.ts`)
- [ ] Database connection pooling works in development and production
- [ ] Seed script populates initial game data from `public/games/*/info.json`
- [ ] Foreign key relationships and cascading deletes work correctly
- [ ] Database queries complete within acceptable latency (<100ms for simple reads)

---

## Phase 6: Subscription Management

**Timeline: 3-4 days**

> **Monetization Context (per `telegram-webapps.md`):**
> 
> Telegram now supports **native monetization** (Stars, paid content, subscriptions) as described in the official documentation (Bot API 8.0+). For this project, we deliberately use a **third-party gateway (FenanPay)** to manage off-Telegram billing, while our application tracks subscription status and credits internally.
> 
> **Key points:**
> - No bot token, init data, or Stars flows are shared with FenanPay.
> - Derive user identity for FenanPay purely from our own `userId` / `telegramUserId`, never from unvalidated launch parameters.
> - Native Telegram monetization (Stars/subscriptions) could later replace or complement FenanPay if desired.

### 6.1 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | 0 ETB | 3 games, ads, limited plays |
| Basic | 49 ETB/month | All games, no ads |
| Premium | 99 ETB/month | All games, no ads, exclusive games |
| VIP | 199 ETB/month | All Premium + early access, badges |

---

### 6.2 Subscription Page

**Create:** `src/app/subscription/page.tsx`

**Features:**
- Current plan display
- Plan comparison cards
- Upgrade/Downgrade buttons
- Payment method selection
- Billing history

---

### 6.3 Subscription API

```
src/app/api/subscription/
├── route.ts              # GET current subscription
├── plans/route.ts        # GET available plans
├── upgrade/route.ts      # POST upgrade subscription
├── cancel/route.ts       # POST cancel subscription
└── history/route.ts      # GET billing history
```

---

### 6.4 Access Control Middleware

**Create:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing premium game
  if (request.nextUrl.pathname.startsWith('/play/')) {
    // Verify subscription status via API
    // Redirect to subscription page if not authorized
  }
  
  return NextResponse.next();
}
```

### ✅ Phase 6 Acceptance Checklist

- [ ] Subscription page displays all available plans (Free, Basic, Premium, VIP)
- [ ] Current plan is highlighted with "Current Plan" badge
- [ ] Plan comparison shows features clearly (games access, ads, exclusives)
- [ ] Upgrade button initiates payment flow for selected plan
- [ ] Downgrade button (if applicable) shows confirmation and effective date
- [ ] `/api/subscription` returns current subscription status and expiry date
- [ ] `/api/subscription/plans` returns all available plans with pricing
- [ ] `/api/subscription/upgrade` creates pending transaction and redirects to payment
- [ ] `/api/subscription/cancel` sets subscription to cancelled state
- [ ] Subscription status is checked before granting access to premium games
- [ ] Expired subscriptions automatically downgrade to Free plan
- [ ] Billing history shows past transactions with dates and amounts
- [ ] Access control middleware blocks premium content for free users
- [ ] Subscription badge updates immediately after successful payment

---

## Phase 7: Wallet System Integration

**Timeline: 3-4 days**

> **Security Note:** The wallet is an **app-local balance**, not Telegram Stars or native paid content. All wallet operations must:
> - Use validated `userId` / `telegramUserId` as identity.
> - Never pass Telegram bot token or raw init data to external services.
> - Keep Telegram secrets strictly internal to our backend.

### 7.1 Wallet Page

**Create:** `src/app/wallet/page.tsx`

**Features:**
- Balance display (large, prominent)
- Top-up button
- Transaction history (infinite scroll)
- Transaction filters (type, date range)
- Each transaction: type icon, description, amount, status, date

---

### 7.2 Wallet API

```
src/app/api/wallet/
├── route.ts              # GET wallet balance
├── transactions/route.ts # GET transaction history
├── topup/route.ts        # POST initiate top-up
└── withdraw/route.ts     # POST request withdrawal
```

---

### 7.3 Transaction Processing

```typescript
// src/lib/wallet.ts

export async function createTransaction(
  userId: string,
  type: TransactionType,
  amount: number,
  description: string,
  reference?: string
) {
  return await prisma.transaction.create({
    data: {
      userId,
      walletId: (await getWallet(userId)).id,
      type,
      amount,
      description,
      reference,
      status: 'PENDING',
    }
  });
}

export async function completeTransaction(
  transactionId: string,
  success: boolean
) {
  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { 
      status: success ? 'COMPLETED' : 'FAILED',
    }
  });
  
  if (success && transaction.type === 'DEPOSIT') {
    await prisma.wallet.update({
      where: { id: transaction.walletId },
      data: { 
        balance: { increment: transaction.amount }
      }
    });
  }
  
  return transaction;
}
```

### ✅ Phase 7 Acceptance Checklist

- [ ] Wallet page displays current balance prominently
- [ ] Balance shows correct currency (ETB) and formatting
- [ ] "Top Up" button initiates deposit flow
- [ ] Transaction history loads with infinite scroll pagination
- [ ] Each transaction shows: type icon, description, amount (+/-), status, date
- [ ] Transaction filters work (All, Deposits, Subscriptions, Refunds)
- [ ] `/api/wallet` returns current balance and currency
- [ ] `/api/wallet/transactions` returns paginated transaction history
- [ ] `/api/wallet/topup` creates pending deposit transaction
- [ ] Wallet balance updates correctly after completed transactions
- [ ] Failed transactions do not affect balance
- [ ] User identity for wallet operations is derived from validated `userId` only
- [ ] No Telegram secrets (bot token, raw init data) are used in wallet operations
- [ ] Decimal precision is maintained (2 decimal places for ETB)
- [ ] Concurrent transaction handling doesn't cause race conditions

---

## Phase 8: FenanPay Payment Gateway Integration

**Timeline: 4-5 days**

> **Integration Scope (per Telegram docs security guidance):**
> 
> FenanPay is used **only** to settle money between our backend and external banking/fiat/crypto rails. Inside Telegram, users interact purely with our own "credits" / "subscription state"—these are **not** Telegram Stars or native in-app purchases.
> 
> **Security requirements:**
> - Never pass Telegram bot token or raw init data to FenanPay.
> - User identity for FenanPay flows is derived from our internal `userId` and `telegramUserId`, not from unvalidated launch parameters.
> - Webhook signature verification is mandatory before processing any payment event.
> - If you later integrate Telegram's native Payments API, that is a separate flow from FenanPay.

### 8.1 FenanPay Setup

**Environment variables:**
```env
FENANPAY_API_KEY=your_api_key
FENANPAY_SECRET_KEY=your_secret_key
FENANPAY_MERCHANT_ID=your_merchant_id
FENANPAY_WEBHOOK_SECRET=your_webhook_secret
FENANPAY_BASE_URL=https://api.fenanpay.com
```

---

### 8.2 Payment Initiation

**Create:** `src/lib/fenanpay.ts`

```typescript
interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  callbackUrl: string;
  returnUrl: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export async function initiatePayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  const response = await fetch(`${process.env.FENANPAY_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FENANPAY_API_KEY}`,
      'X-Merchant-ID': process.env.FENANPAY_MERCHANT_ID!,
    },
    body: JSON.stringify(request),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    return { success: false, error: data.message };
  }
  
  return {
    success: true,
    paymentUrl: data.paymentUrl,
    transactionId: data.transactionId,
  };
}
```

---

### 8.3 Payment API Endpoints

```
src/app/api/payment/
├── initiate/route.ts     # POST start payment
├── webhook/route.ts      # POST FenanPay callback
├── verify/route.ts       # GET verify payment status
└── cancel/route.ts       # POST cancel payment
```

**Webhook handler:**
```typescript
// src/app/api/payment/webhook/route.ts

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-fenanpay-signature');
  const body = await request.text();
  
  // Verify webhook signature
  const isValid = verifyWebhookSignature(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const payload = JSON.parse(body);
  
  switch (payload.event) {
    case 'payment.completed':
      await handlePaymentCompleted(payload.data);
      break;
    case 'payment.failed':
      await handlePaymentFailed(payload.data);
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

---

### 8.4 Payment Flow

1. User clicks "Top Up" on wallet page
2. User enters amount
3. Frontend calls `/api/payment/initiate`
4. Backend creates pending transaction, calls FenanPay API
5. Backend returns payment URL
6. Frontend opens payment URL (in Telegram browser or popup)
7. User completes payment on FenanPay
8. FenanPay sends webhook to `/api/payment/webhook`
9. Backend verifies webhook, updates transaction status
10. Backend updates wallet balance
11. User returns to app, sees updated balance

### ✅ Phase 8 Acceptance Checklist

- [ ] FenanPay API credentials are configured in environment variables
- [ ] `/api/payment/initiate` successfully creates payment request with FenanPay
- [ ] Payment URL is returned and opens correctly (in Telegram browser or popup)
- [ ] User can complete test payment on FenanPay sandbox
- [ ] Webhook endpoint `/api/payment/webhook` receives callbacks from FenanPay
- [ ] Webhook signature verification rejects invalid signatures
- [ ] `payment.completed` webhook updates transaction to COMPLETED and credits wallet
- [ ] `payment.failed` webhook updates transaction to FAILED without affecting balance
- [ ] `/api/payment/verify` can check payment status on-demand
- [ ] Return URL brings user back to app with updated balance displayed
- [ ] No bot token or raw init data is sent to FenanPay
- [ ] User identity in FenanPay requests uses internal `userId`/`telegramUserId` only
- [ ] Payment reference IDs are unique and traceable
- [ ] Idempotency: duplicate webhooks don't double-credit the wallet
- [ ] Error states are handled gracefully with user-friendly messages
- [ ] Payment flow works end-to-end in FenanPay sandbox environment

---

## Phase 9: Testing & Deployment

**Timeline: 2-3 days**

> **Test Environment First (per `telegram-creating-new-app.md`):**
> 
> - Use the Telegram **test environment** for all development and initial testing.
> - Test environment allows HTTP (non-TLS) and direct IP usage, isolating experimentation from production users.
> - Only configure the production Mini App URL (`/myapps` > Edit link) once HTTPS and backend security are fully validated.
> - See the Test Environment article in Telegram docs for switching instructions.

### 9.1 Testing Checklist

**Authentication:**
- [ ] Auth works in Telegram mobile (iOS)
- [ ] Auth works in Telegram mobile (Android)
- [ ] Auth works in Telegram Desktop
- [ ] Auth works in Telegram Web
- [ ] Guest mode works when outside Telegram

**Games:**
- [ ] All 5 games load correctly
- [ ] Games are fullscreen
- [ ] Fullscreen button works
- [ ] Back button works
- [ ] Controls auto-hide
- [ ] Sound works

**UI/UX:**
- [ ] Home page renders correctly
- [ ] Navigation works
- [ ] Theme adapts to Telegram theme
- [ ] Safe areas respected
- [ ] Loading states shown
- [ ] Error states handled

**Subscription:**
- [ ] Plans display correctly
- [ ] Upgrade flow works
- [ ] Downgrade flow works
- [ ] Access control works

**Wallet:**
- [ ] Balance displays correctly
- [ ] Top-up flow works
- [ ] Transaction history loads
- [ ] Pagination works

**Payments:**
- [ ] Payment initiation works
- [ ] Redirect to FenanPay works
- [ ] Webhook received and processed
- [ ] Balance updated after payment
- [ ] Failed payments handled

---

### 9.2 Deployment Steps

1. **Set up PostgreSQL database (Supabase/Neon/PlanetScale)**

2. **Configure environment variables on Vercel:**
   ```
   DATABASE_URL
   BOT_TOKEN
   FENANPAY_API_KEY
   FENANPAY_SECRET_KEY
   FENANPAY_MERCHANT_ID
   FENANPAY_WEBHOOK_SECRET
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

5. **Configure webhook URL in FenanPay dashboard:**
   ```
   https://your-domain.vercel.app/api/payment/webhook
   ```

6. **Update bot menu button in @BotFather**

7. **Test in Telegram test environment first**

8. **Launch to production**

### ✅ Phase 9 Acceptance Checklist

- [ ] All Phase 1-8 acceptance checklists are complete
- [ ] App tested in Telegram **test environment** before production
- [ ] App works on Telegram iOS (iPhone, iPad)
- [ ] App works on Telegram Android (phone, tablet)
- [ ] App works on Telegram Desktop (Windows, macOS, Linux)
- [ ] App works on Telegram Web (WebK, WebA)
- [ ] Guest mode works gracefully when opened outside Telegram
- [ ] All 5 games load, play, and exit correctly
- [ ] Fullscreen mode works on supported clients
- [ ] Sound and controls function in all games
- [ ] Theme adapts to light/dark Telegram themes
- [ ] Safe areas respected on notched devices
- [ ] Loading states shown during async operations
- [ ] Error states display user-friendly messages
- [ ] PostgreSQL database deployed and migrated
- [ ] Environment variables configured on Vercel
- [ ] FenanPay webhook URL configured in dashboard
- [ ] Bot menu button updated in @BotFather (`/setmenubutton`)
- [ ] Production Mini App URL set via `/myapps` > Edit link
- [ ] HTTPS certificate valid and auto-renewing
- [ ] No console errors in production build
- [ ] Performance: initial load < 3 seconds on 3G connection
- [ ] Lighthouse score > 80 for Performance, Accessibility, Best Practices

---

## 📁 Final Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── games/
│   │   ├── page.tsx                # Games catalog
│   │   └── [slug]/page.tsx         # Game detail
│   ├── play/
│   │   └── [slug]/page.tsx         # Game player (fullscreen)
│   ├── profile/
│   │   └── page.tsx                # User profile
│   ├── subscription/
│   │   └── page.tsx                # Subscription plans
│   ├── wallet/
│   │   └── page.tsx                # Wallet & transactions
│   └── api/
│       ├── auth/validate/route.ts
│       ├── games/route.ts
│       ├── user/route.ts
│       ├── subscription/
│       ├── wallet/
│       └── payment/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── BottomNav.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── GameCard.tsx
│   │   └── GameGrid.tsx
│   ├── games/
│   │   └── GamePlayer.tsx
│   ├── subscription/
│   │   └── PlanCard.tsx
│   ├── wallet/
│   │   ├── BalanceCard.tsx
│   │   └── TransactionItem.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       └── Skeleton.tsx
├── lib/
│   ├── prisma.ts
│   ├── fenanpay.ts
│   └── wallet.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useWallet.ts
│   └── useSubscription.ts
└── utils/
    ├── initDataApi.ts
    └── launchParamsCache.ts
```

---

## 📊 Timeline Summary

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: UI/UX Fix | 2-3 days | CRITICAL |
| Phase 2: Auth Fix | 2-3 days | HIGH |
| Phase 3: Profile | 2-3 days | MEDIUM |
| Phase 4: Game Library | 3-4 days | HIGH |
| Phase 5: Database | 2-3 days | HIGH |
| Phase 6: Subscription | 3-4 days | MEDIUM |
| Phase 7: Wallet | 3-4 days | MEDIUM |
| Phase 8: FenanPay | 4-5 days | MEDIUM |
| Phase 9: Testing | 2-3 days | HIGH |

**Total Estimated Time: 24-32 days**

---

## 🚀 Quick Start (MVP)

For fastest launch, implement in this order:
1. **Phase 1.1** - Fix game player fullscreen (CRITICAL)
2. **Phase 1.2** - Redesign home page (CRITICAL)
3. **Phase 2.1** - Fix auth flow (HIGH)
4. **Phase 4.3** - Enhanced game player (HIGH)

This gives you a working prototype in ~5-7 days.

---

*Document created: November 28, 2025*  
*Last updated: November 28, 2025*
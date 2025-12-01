# 📱 Pages Design Plan: Games, Wallet & Profile

> **Goal:** Create visually rich, well-structured pages with excellent UX even before real data integration  
> **Design Principles:** Consistency, visual hierarchy, intuitive navigation, delightful micro-interactions

---

## 🎨 Design System Recap

### Color Palette
- **Primary Gradient:** `from-gaming-purple to-gaming-pink` (#9333EA → #EC4899)
- **Background:** `tg-bg` (dark navy #1a1a2e)
- **Cards:** `tg-secondary` (#16213e) with `border-white/5`
- **Text:** White for headings, `tg-hint` for secondary text
- **Accents:** Cyan (#06B6D4), Blue (#3B82F6)

### Shared Components to Create
- `StatCard` - Display numbers with labels and icons
- `SectionHeader` - Consistent section titles with optional action
- `ListItem` - For settings, transactions, achievements
- `EmptyState` - Friendly empty states with illustrations
- `ProgressBar` - For levels, achievements
- `TabGroup` - Alternative tab navigation within pages

---

## 📄 Page 1: Games Page (`/games`)

### Purpose
Dedicated games browsing experience with search, filters, and curated collections.

### Layout Structure

```
┌─────────────────────────────────────┐
│  🔍 Search Bar                      │  ← Sticky search
├─────────────────────────────────────┤
│  Filter Chips (All|Arcade|Puzzle|..)│  ← Horizontal scroll
├─────────────────────────────────────┤
│  🔥 Trending Now                    │
│  ┌─────┐ ┌─────┐ ┌─────┐           │  ← Horizontal scroll cards
│  │     │ │     │ │     │ →         │
│  └─────┘ └─────┘ └─────┘           │
├─────────────────────────────────────┤
│  ⭐ Editor's Picks                  │
│  ┌─────────────────────────────┐   │  ← Featured large card
│  │     Featured Game           │   │
│  │     with overlay text       │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  🎮 All Games                       │
│  ┌─────┐ ┌─────┐                   │  ← 2-column grid
│  │     │ │     │                   │
│  └─────┘ └─────┘                   │
│  ┌─────┐ ┌─────┐                   │
│  │     │ │     │                   │
│  └─────┘ └─────┘                   │
└─────────────────────────────────────┘
```

### Components

#### 1. SearchBar Component
```
┌──────────────────────────────────────┐
│ 🔍  Search games...            ⚙️   │
└──────────────────────────────────────┘
```
- Glassmorphism background
- Search icon left, filter icon right
- Placeholder text animation
- Focus state with purple border

#### 2. FilterChips Component
- Horizontal scrollable
- Active chip has gradient background
- Inactive chips have subtle border
- Categories: All, Arcade, Puzzle, Racing, Action, Strategy

#### 3. TrendingSection Component
- Horizontal scroll with snap
- Cards slightly smaller than GameCard
- Show rank badge (#1, #2, #3)
- Fire emoji for trending indicator

#### 4. FeaturedCard Component
- Full-width, taller aspect ratio (16:9)
- Large background image with gradient overlay
- Game title, description overlay at bottom
- "Play Now" button overlay
- Pulsing "Featured" badge

#### 5. GameListSection Component
- Reuses GameGrid from home
- "See All" link if limited display
- Filter integration

### UX Considerations
- Search debounce (300ms)
- Skeleton loading for each section
- Pull-to-refresh gesture support
- Keyboard dismiss on scroll
- Recent searches (future feature indicator)

---

## 📄 Page 2: Wallet Page (`/wallet`)

### Purpose
Central hub for balance, transactions, subscriptions, and payment methods.

### Layout Structure

```
┌─────────────────────────────────────┐
│        💰 Your Balance              │
│         ████████████                │
│           $12.50                    │  ← Large balance display
│      ┌──────┐  ┌──────┐            │
│      │ Add  │  │ Send │            │  ← Action buttons
│      └──────┘  └──────┘            │
├─────────────────────────────────────┤
│  ⚡ Quick Actions                   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │  ← 4-item grid
│  │💳│ │🎁│ │📊│ │⚙️│           │
│  │Pay│ │Gift│ │Stats│ │Set│        │
│  └───┘ └───┘ └───┘ └───┘          │
├─────────────────────────────────────┤
│  👑 Subscription Status             │
│  ┌─────────────────────────────┐   │
│  │ 🆓 Free Plan                 │   │  ← Subscription card
│  │ 3/5 games played today       │   │
│  │ [━━━━━━░░░░] 60%            │   │
│  │ 🚀 Upgrade to Premium        │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  📜 Recent Transactions             │
│  ┌─────────────────────────────┐   │
│  │ ↓ Deposit    +$10.00   Today│   │
│  ├─────────────────────────────┤   │
│  │ ↑ Ninja Leap -$0.50  Nov 30 │   │
│  ├─────────────────────────────┤   │
│  │ ↓ Referral   +$2.00  Nov 29 │   │
│  └─────────────────────────────┘   │
│           See All →                 │
├─────────────────────────────────────┤
│  💳 Payment Methods                 │
│  ┌─────────────────────────────┐   │
│  │ 🏦 FenanPay        Connected│   │
│  │ + Add Payment Method         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Components

#### 1. BalanceCard Component
```
┌─────────────────────────────────────┐
│          Your Balance               │
│     ✨ $12.50 ✨                    │  ← Animated sparkles
│                                     │
│   ┌─────────┐   ┌─────────┐        │
│   │  ➕ Add  │   │  ➡️ Send │        │
│   └─────────┘   └─────────┘        │
└─────────────────────────────────────┘
```
- Gradient background (purple to pink)
- Large animated balance number
- Money formatting with currency
- Two action buttons below
- Glassmorphism card style

#### 2. QuickActions Grid
- 4 circular icon buttons
- Labels below icons
- Subtle bounce on tap
- Options: Top Up, Gift, History, Settings

#### 3. SubscriptionCard Component
- Shows current plan (Free/Premium)
- Usage progress bar
- Limit indicator (X/Y games today)
- Upgrade CTA button
- Premium benefits preview

#### 4. TransactionList Component
- Grouped by date
- Icon based on transaction type
- Color coding (green for +, red for -)
- Amount with currency
- Timestamp
- Tap to see details (future)

#### 5. PaymentMethods Component
- List of connected payment methods
- FenanPay integration indicator
- Add new method button
- Edit/remove capability indicator

### UX Considerations
- Balance updates with animation
- Pull-to-refresh for transactions
- Skeleton loading for all cards
- Empty states for no transactions
- Secure blur for balance (privacy mode - future)
- Haptic feedback on actions

---

## 📄 Page 3: Profile Page (`/profile`)

### Purpose
User identity, achievements, settings, and personalization hub.

### Layout Structure

```
┌─────────────────────────────────────┐
│         ┌─────────┐                 │
│         │  👤     │                 │  ← Large avatar
│         │ Avatar  │                 │
│         └─────────┘                 │
│         Vladislav                   │  ← Username
│         @username                   │  ← Handle
│         ⭐ Level 5 Gamer            │  ← Level badge
├─────────────────────────────────────┤
│  📊 Your Stats                      │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 42  │ │ 12  │ │ 3.2k│          │
│  │Games│ │Hours│ │Score│          │
│  └─────┘ └─────┘ └─────┘          │
├─────────────────────────────────────┤
│  🏆 Achievements                    │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ →       │  ← Horizontal scroll
│  │🎯│ │🔥│ │⭐│ │🎮│            │
│  └───┘ └───┘ └───┘ └───┘          │
│  8 of 25 unlocked                   │
├─────────────────────────────────────┤
│  📈 Level Progress                  │
│  Level 5 ━━━━━━━━░░░░ Level 6      │
│  250 XP to next level               │
├─────────────────────────────────────┤
│  ⚙️ Settings                        │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Notifications        → │   │
│  │ 🌙 Dark Mode           🔘 │   │
│  │ 🌐 Language         EN → │   │
│  │ 🔒 Privacy              → │   │
│  │ 📱 Linked Accounts      → │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  ℹ️ About                           │
│  ┌─────────────────────────────┐   │
│  │ 📄 Terms of Service         │   │
│  │ 🔐 Privacy Policy           │   │
│  │ 💬 Contact Support          │   │
│  │ ⭐ Rate Us                  │   │
│  └─────────────────────────────┘   │
│                                     │
│         Version 1.0.0               │
└─────────────────────────────────────┘
```

### Components

#### 1. ProfileHeader Component
```
┌─────────────────────────────────────┐
│              ┌───────┐              │
│              │       │              │
│              │ 👤    │  ← Edit btn  │
│              │       │              │
│              └───────┘              │
│          Vladislav K.               │
│          @vladislav                 │
│    ┌────────────────────┐          │
│    │ ⭐ Level 5 Gamer   │          │
│    └────────────────────┘          │
└─────────────────────────────────────┘
```
- Large avatar (80px) with edit button overlay
- Full name with optional verification badge
- Username/handle in hint color
- Level badge with gradient background
- Join date (small text)

#### 2. StatsGrid Component
- 3-column grid
- Each stat: large number + label
- Animated counter on mount
- Suggested stats: Games Played, Hours Played, High Score

#### 3. AchievementSlider Component
- Horizontal scrollable badges
- Unlocked: full color with glow
- Locked: grayscale with lock icon
- Progress text below
- Tap to view achievement details (modal)

#### 4. LevelProgress Component
- Current level indicator
- Progress bar with gradient
- XP needed text
- Animated fill on mount

#### 5. SettingsSection Component
- Grouped list items
- Icon + Label + Value/Toggle/Arrow
- Toggle for Dark Mode
- Disclosure arrows for sub-pages
- Haptic feedback on toggles

#### 6. AboutSection Component
- List of links
- App version at bottom
- Opens native links or modals

### UX Considerations
- Avatar edit triggers Telegram photo picker
- Stats animate on first view
- Achievement unlock celebration (future)
- Settings persist to localStorage
- Smooth scroll behavior
- Pull-down to see profile in Telegram

---

## 🧩 Shared UI Components to Create

### 1. StatCard
```tsx
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}
```

### 2. SectionHeader
```tsx
interface SectionHeaderProps {
  title: string;
  emoji?: string;
  action?: { label: string; onClick: () => void };
}
```

### 3. ListItem
```tsx
interface ListItemProps {
  icon: string;
  label: string;
  value?: string;
  onClick?: () => void;
  toggle?: { checked: boolean; onChange: (checked: boolean) => void };
  showArrow?: boolean;
}
```

### 4. EmptyState
```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}
```

### 5. ProgressBar
```tsx
interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
}
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── games/
│   │   └── page.tsx          # Games page
│   ├── wallet/
│   │   └── page.tsx          # Wallet page
│   └── profile/
│       └── page.tsx          # Profile page
├── components/
│   ├── games/
│   │   ├── SearchBar.tsx
│   │   ├── FilterChips.tsx
│   │   ├── TrendingSection.tsx
│   │   ├── FeaturedCard.tsx
│   │   └── index.ts
│   ├── wallet/
│   │   ├── BalanceCard.tsx
│   │   ├── QuickActions.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── PaymentMethods.tsx
│   │   └── index.ts
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── AchievementSlider.tsx
│   │   ├── LevelProgress.tsx
│   │   ├── SettingsSection.tsx
│   │   └── index.ts
│   └── ui/
│       ├── StatCard.tsx
│       ├── SectionHeader.tsx
│       ├── ListItem.tsx
│       ├── EmptyState.tsx
│       ├── ProgressBar.tsx
│       └── index.ts (update)
```

---

## 🎭 Mock Data Strategy

Since real data isn't available yet, create compelling mock data:

### Games Page
- Use existing games from `/public/games/`
- Add fake trending/popularity indicators
- Generate random play counts

### Wallet Page
- Mock balance: $12.50
- 5-10 sample transactions
- Free plan with usage limits

### Profile Page
- Use Telegram user data from SDK
- Generate random stats
- 8 unlocked achievements (of 25)
- Level 5 with 60% progress to Level 6

---

## ⏱️ Implementation Priority

1. **Phase 1:** Create shared UI components (StatCard, SectionHeader, ListItem, etc.)
2. **Phase 2:** Build Games page with all sections
3. **Phase 3:** Build Wallet page with mock data
4. **Phase 4:** Build Profile page with Telegram integration
5. **Phase 5:** Polish animations and interactions

---

## ✅ Success Criteria

- [ ] All 3 pages are navigable from BottomNav
- [ ] Each page has distinct, purposeful sections
- [ ] Skeleton loading states for async content
- [ ] Empty states where applicable
- [ ] Consistent use of design system
- [ ] Smooth animations and transitions
- [ ] Mobile-first responsive design
- [ ] Works correctly in Telegram Mini App environment

---

*Document created: December 1, 2025*

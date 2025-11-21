# Phase 0 & 1 Implementation Guide
## Telegram Mini App Development with Next.js Template

**Document Version**: 1.0  
**Last Updated**: November 17, 2025  
**Target Audience**: Developers new to Telegram Mini Apps development  
**Prerequisites**: Knowledge of TypeScript, React, Next.js, Node.js

---

## Table of Contents
- [Phase 0: Foundations & Planning](#phase-0-foundations--planning)
- [Phase 1: Local Environment Setup](#phase-1-local-environment-setup)
- [Reference Links](#reference-links)

---

# Phase 0: Foundations & Planning

## Overview

**Purpose**: Establish a solid foundation for your Telegram Mini App by defining scope, architecture, security requirements, and technical decisions before writing any code.

**Why This Phase Matters**:
- Prevents scope creep and unnecessary feature development
- Identifies security vulnerabilities early in the design phase
- Ensures alignment between business goals and technical implementation
- Reduces costly refactoring later by making architectural decisions upfront

**Expected Duration**: 1-3 days (depending on complexity)

**Key Outcomes**:
- ✅ Documented MVP scope and feature set
- ✅ Identified target platforms and user access patterns
- ✅ Security and data flow architecture
- ✅ Hosting and deployment strategy
- ✅ Success metrics and monitoring plan

---

## Step 1: Clarify Core App Purpose & MVP Scope

### What to Do
Define the **core problem** your Mini App solves and identify the **minimum viable product (MVP)** features needed for launch.

### Why This Matters
Telegram Mini Apps have unique constraints (webview environment, performance expectations, user behavior patterns). Starting with a focused MVP helps you:
- Test core assumptions quickly
- Avoid over-engineering
- Launch faster and gather real user feedback

### Implementation Guide

#### 1.1 Document Your App's Purpose
Create a simple one-page document answering:

```markdown
# [Your App Name] - Product Brief

## Problem Statement
What user problem does this Mini App solve?
Example: "Users need a fast way to split bills with friends without leaving Telegram."

## Target Audience
Who will use this app?
Example: "Telegram users aged 18-35 who frequently share expenses with groups."

## Core Value Proposition
What makes this app unique/valuable?
Example: "Instant bill splitting with automatic Telegram notifications to all participants."

## MVP Features (Must-Have)
List only essential features for launch:
- [ ] User authentication via Telegram init data
- [ ] Create new bill with split amounts
- [ ] Share bill via Telegram
- [ ] View payment status

## Post-MVP Features (Nice-to-Have)
Features to add after validating core concept:
- [ ] TON Connect wallet integration
- [ ] Recurring bill subscriptions
- [ ] Bill history & analytics
```

#### 1.2 Validate Against Telegram Mini Apps Capabilities
Cross-reference your MVP features with Telegram Mini Apps platform capabilities:

**Available Platform Features** (from official docs):
- ✅ User authentication (init data validation)
- ✅ Theme integration (light/dark mode)
- ✅ Native UI components (buttons, popups, haptics)
- ✅ Deep linking (start parameters)
- ✅ TON wallet integration
- ✅ Cloud storage (small key-value pairs)
- ✅ Payments (Telegram Stars)
- ✅ Media sharing
- ✅ QR scanning
- ✅ Biometric authentication
- ✅ Geolocation (Bot API 8.0+)

**Constraints to Consider**:
- ⚠️ Webview environment (no native mobile APIs)
- ⚠️ HTTPS required in production
- ⚠️ Limited persistent storage (use CloudStorage/SecureStorage)
- ⚠️ User can close app anytime (no guaranteed session)

---

## Step 2: Define Target Platforms

### What to Do
Identify which Telegram clients your app will support and optimize for.

### Available Platforms
According to Telegram Mini Apps documentation, supported platforms include:

| Platform | Identifier | Notes |
|----------|-----------|-------|
| **Android** | `android` | Mobile, full feature support |
| **iOS** | `ios` | Mobile, full feature support |
| **macOS** | `macos` | Desktop, limited sensor support |
| **Windows** | `tdesktop` | Desktop (Telegram Desktop) |
| **Web** | `web`, `weba`, `webk` | Browser-based, varying capabilities |

### Implementation Guide

#### 2.1 Platform Selection Template
```markdown
# Supported Platforms

## Primary Targets (Must Work Perfectly)
- [ ] Android (mobile)
- [ ] iOS (mobile)
- [ ] Web (https://web.telegram.org/k/)

## Secondary Targets (Best-Effort Support)
- [ ] macOS Desktop
- [ ] Windows Desktop

## Platform-Specific Considerations

### Mobile (Android/iOS)
- Full feature support (sensors, biometrics, haptics)
- Optimize for touch interactions
- Test fullscreen mode
- Verify safe area handling (notches, home indicators)

### Desktop (macOS/Windows)
- Limited sensor support (no accelerometer/gyroscope)
- Mouse/keyboard interaction patterns
- Larger viewport considerations

### Web
- Varies by browser (check `tgWebAppPlatform` parameter)
- Test across major browsers (Chrome, Safari, Firefox)
- No biometric support typically
```

#### 2.2 Feature Matrix by Platform
Create a matrix of MVP features vs platforms:

```markdown
| Feature | Android | iOS | Web | Desktop |
|---------|---------|-----|-----|---------|
| Auth (init data) | ✅ | ✅ | ✅ | ✅ |
| Theme params | ✅ | ✅ | ✅ | ✅ |
| Haptic feedback | ✅ | ✅ | ❌ | ❌ |
| Biometric auth | ✅ | ✅ | ⚠️ | ⚠️ |
| QR scanner | ✅ | ✅ | ✅ | ✅ |
| TON wallet | ✅ | ✅ | ✅ | ✅ |
```

**Legend**: ✅ Full Support | ⚠️ Limited/Variable | ❌ Not Supported

---

## Step 3: Decide Feature Set & Integrations

### What to Do
Map your MVP features to specific Telegram Mini Apps capabilities and integrations.

### Core Features to Consider

#### 3.1 Authentication (REQUIRED)
**Decision**: How will you authenticate users?

```markdown
# Authentication Strategy

## Method: Telegram Init Data Validation
- **Client-side**: Use `retrieveLaunchParams()` to get `initDataRaw`
- **Server-side**: Validate HMAC-SHA256 signature with bot token
- **Session**: Issue short-lived JWT token after validation (optional)

## Implementation Notes
- Use `@telegram-apps/init-data-node` (Node.js backend)
- Set expiration window: 1 hour (3600 seconds)
- Store user session in database or memory store
- Implement replay protection (track validated hashes)

## Security Requirements
- ✅ Always validate init data server-side
- ✅ Never trust client-parsed data before validation
- ✅ Keep bot token SECRET (environment variable only)
- ✅ Use HTTPS in production
```

#### 3.2 TON Connect (OPTIONAL)
**Decision**: Will you integrate TON blockchain wallet functionality?

```markdown
# TON Connect Integration: [YES/NO]

## If YES:
- Use `@tonconnect/ui-react` (already in template dependencies)
- Features needed:
  - [ ] Wallet connection/disconnection
  - [ ] Display user balance
  - [ ] Send transactions
  - [ ] Sign messages
- Server validation: Verify transaction proofs

## Implementation References
- Template: `src/app/ton-connect/page.tsx`
- Docs: https://docs.ton.org/develop/dapps/ton-connect/overview
```

#### 3.3 Payments (Telegram Stars)
**Decision**: Will you monetize via Telegram Stars subscriptions/gifts?

```markdown
# Telegram Stars Payments: [YES/NO]

## If YES (Bot API 8.0+):
### Subscription Plans
- Define tiers (Basic, Premium, etc.)
- Set pricing in Telegram Stars
- Configure recurring intervals

### Gifts
- Allow users to send Stars gifts
- Track gift transactions

## Implementation Notes
- Integrate Telegram payments API
- Server-side receipt validation
- Database schema for subscriptions/payments
- Handle payment webhooks
```

#### 3.4 Storage Strategy
**Decision**: What data needs persistence?

```markdown
# Storage Architecture

## Client-Side Storage
Use Telegram storage APIs (feature detection required):

### CloudStorage (Bot API 6.9+)
- **Purpose**: Small key-value pairs synced across devices
- **Capacity**: Max 1024 keys per user
- **Use Cases**: User preferences, settings, UI state
- **Security**: NOT encrypted; avoid sensitive data

### DeviceStorage (Bot API 9.0+)
- **Purpose**: Larger local storage on device
- **Capacity**: Greater than CloudStorage
- **Use Cases**: Cached data, offline content
- **Security**: NOT encrypted; device-specific

### SecureStorage (Bot API 9.0+)
- **Purpose**: Encrypted storage for secrets
- **Use Cases**: Auth tokens, API keys, credentials
- **Security**: Encrypted at rest; device-specific

## Server-Side Storage
Database selection:

### Option 1: PostgreSQL (Recommended for production)
- Full relational database
- ACID transactions
- Prisma ORM support (already in template docs)

### Option 2: SQLite (Good for prototyping)
- Serverless, file-based
- Easy local development
- Migrate to PostgreSQL for production

### Data to Store Server-Side
- [ ] User profiles (id, username, language_code)
- [ ] Application-specific data (bills, transactions, etc.)
- [ ] Session tokens (optional, can use stateless JWT)
- [ ] Validated init data hashes (replay protection)
```

#### 3.5 Deep Linking Strategy
**Decision**: Will you use start parameters for deep linking?

```markdown
# Deep Linking with Start Parameters

## Use Cases
- [ ] Referral tracking: `startapp=REF_USER123`
- [ ] Entity deep links: `startapp=BILL_456`
- [ ] Campaign tracking: `startapp=PROMO_SUMMER`
- [ ] Pre-filled forms: `startapp=JOIN_TEAM789`

## Implementation Plan
1. Parse start parameter from URL query: `?startapp=VALUE`
2. Extract from init data: `start_param` field
3. Validate server-side (check permissions, resolve entity)
4. Route user to appropriate UI state

## Security Notes
- Max length: 512 characters
- Allowed chars: `A-Z a-z 0-9 _ -`
- Treat as untrusted input
- Use opaque tokens (not actual IDs)
```

---

## Step 4: Security & Data Flow Architecture

### What to Do
Design your app's security model and data flow between client, server, and Telegram.

### Implementation Guide

#### 4.1 Data Flow Diagram
Create a visual or text representation:

```
┌─────────────┐
│  Telegram   │
│   Client    │
└──────┬──────┘
       │ Launch Mini App with initDataRaw
       │ (hash fragment: tgWebAppData=...)
       ▼
┌─────────────────┐
│   Mini App      │
│   (Frontend)    │ ← nextjs-template (this repository)
└────────┬────────┘
         │ 1. Extract initDataRaw via retrieveLaunchParams()
         │ 2. Send to backend: Authorization: tma <initDataRaw>
         ▼
┌─────────────────┐
│   Backend API   │
│   (Node.js)     │
└────────┬────────┘
         │ 3. Validate HMAC signature with bot token
         │ 4. Parse user data (user.id, username, etc.)
         │ 5. Create/update session
         ▼
┌─────────────────┐
│    Database     │
│  (PostgreSQL)   │
└─────────────────┘
```

#### 4.2 Sensitive Data Inventory
List all sensitive data and how it's protected:

```markdown
# Sensitive Data Protection Plan

## Critical Secrets
| Secret | Storage | Access | Notes |
|--------|---------|--------|-------|
| Bot Token | Server env var | Server-only | NEVER in client code |
| Database credentials | Server env var | Server-only | Use connection pooling |
| API keys (3rd party) | SecureStorage (client) or env var (server) | As needed | Encrypt before client storage |

## User Data (PII)
| Data | Source | Storage | Protection |
|------|--------|---------|------------|
| User ID | Init data | Database | No PII risk (just Telegram ID) |
| Username | Init data | Database | Public info, low risk |
| Phone number | Optional (requestContact) | Database | Encrypted, user consent required |
| Payment info | Telegram | Not stored | Handle via Telegram APIs only |

## Security Controls
- [ ] Init data validation on every request
- [ ] HTTPS enforcement (production)
- [ ] CSRF protection (token-based)
- [ ] Rate limiting (per user/IP)
- [ ] Input sanitization (XSS prevention)
- [ ] SQL injection prevention (parameterized queries via Prisma)
```

---

## Step 5: Hosting & Deployment Strategy

### What to Do
Choose where and how you'll deploy your Mini App.

### Recommended: Vercel (per README.md)
The template README recommends Vercel for deployment. Here's why:

**Advantages**:
- ✅ Automatic HTTPS with SSL certificate
- ✅ Built for Next.js (zero config)
- ✅ Global CDN for fast loading
- ✅ Preview deployments for testing
- ✅ Environment variable management
- ✅ Free tier available

### Implementation Guide

#### 5.1 Hosting Decision Template
```markdown
# Hosting Strategy

## Platform: Vercel (Recommended)
**Tier**: [Free / Pro]
**Region**: [Closest to users, e.g., US East, EU]

### Configuration Needed
- [ ] Connect GitHub repository
- [ ] Configure build settings (auto-detected for Next.js)
- [ ] Set environment variables:
  - `BOT_TOKEN` (from BotFather)
  - `DATABASE_URL` (PostgreSQL connection string)
  - `NODE_ENV=production`
  - `API_BASE_URL` (your API endpoint if separate)
  - `NEXT_PUBLIC_TON_MANIFEST_URL` (if using TON Connect)

### Domain Strategy
**Option 1: Vercel Subdomain**
- Free: `your-app.vercel.app`
- Auto SSL, immediate availability

**Option 2: Custom Domain** (Recommended for production)
- Purchase: `yourapp.com`
- DNS: Point to Vercel
- Auto SSL via Vercel

## Alternative: Self-Hosted
If not using Vercel:
- Platform: [AWS/DigitalOcean/Heroku]
- SSL: Manual Let's Encrypt setup
- Build: Run `pnpm run build` and `pnpm start`
```

#### 5.2 Production Domain Planning
```markdown
# Domain Configuration

## Test Environment
- URL: `https://test-myapp.vercel.app`
- BotFather: Configure test bot with this URL
- Purpose: Development & QA

## Production Environment
- URL: `https://myapp.com` (or `myapp.vercel.app`)
- BotFather: Configure production bot
- Purpose: Live users

## SSL Requirements
✅ CRITICAL: Production Mini Apps MUST use HTTPS
- Vercel: Automatic SSL provisioning
- Custom: Ensure valid certificate before BotFather config
```

---

## Step 6: Success Metrics & Monitoring

### What to Do
Define how you'll measure success and monitor app health.

### Implementation Guide

#### 6.1 Key Metrics Template
```markdown
# Success Metrics & KPIs

## User Engagement
- **Daily Active Users (DAU)**: Target: [100/1000/10000]
- **Session Length**: Target: [2 min average]
- **Retention**: Day 1: [40%], Day 7: [20%], Day 30: [10%]

## Technical Performance
- **Time to Ready**: Init to `ready()` call < 2 seconds
- **API Latency**: p95 < 500ms
- **Error Rate**: < 1% of requests
- **Crash Rate**: < 0.1% of sessions

## Business Metrics (if applicable)
- **Conversion Rate**: Free → Paid
- **Revenue**: Telegram Stars subscriptions/gifts
- **Viral Coefficient**: Referrals per user

## Monitoring Tools
### Option 1: Vercel Analytics (Built-in)
- Free tier: Basic metrics
- Pro tier: Advanced analytics

### Option 2: Custom Solution
- **Frontend Logging**: Console wrapper → backend API
- **Backend Logging**: Structured JSON logs (Winston/Pino)
- **Aggregation**: [Logtail / ELK Stack / Datadog]
- **Alerting**: Email/Slack on critical errors

## Logging Strategy
```typescript
// Log levels
enum LogLevel {
  DEBUG = 'debug',    // Development only
  INFO = 'info',      // Normal operations
  WARN = 'warn',      // Recoverable errors
  ERROR = 'error',    // Critical failures
}

// Events to log
const criticalEvents = [
  'auth_success',
  'auth_failure',
  'payment_initiated',
  'payment_completed',
  'storage_error',
  'api_error',
];
```
```

#### 6.2 Alerting Thresholds
```markdown
# Alert Configuration

## Critical (Immediate Action)
- ❗ Error rate > 5% (last 5 minutes)
- ❗ Auth failure rate > 10% (last 5 minutes)
- ❗ API p95 latency > 2s (last 10 minutes)
- ❗ Server down (health check fails)

## Warning (Investigate Soon)
- ⚠️ Error rate > 2% (last 15 minutes)
- ⚠️ Time to Ready > 3s (last 30 minutes)
- ⚠️ CloudStorage quota > 80%

## Info (Track Over Time)
- ℹ️ Daily active users trend
- ℹ️ Feature usage statistics
- ℹ️ Platform distribution (Android/iOS/Web)
```

---

## Step 7: Document Access Pattern Decision

### What to Do
Choose how users will access your Mini App: Menu Button, Direct Link, or both.

### Options Explained

#### Option 1: Menu Button (`/setmenubutton`)
**Use Case**: Conversational bots with embedded tools

**Advantages**:
- ✅ Discoverable within bot chat
- ✅ Contextual (user is already chatting with bot)
- ✅ Persistent access point

**Disadvantages**:
- ❌ Requires user to start bot chat first
- ❌ Less direct than link sharing

**BotFather Setup**:
```
/setmenubutton
> Select your bot
> Provide URL: https://your-app.vercel.app
> Provide button title: "Open App"
```

#### Option 2: Direct Mini App Link (`/myapps`)
**Use Case**: Standalone apps, link sharing, faster entry

**Advantages**:
- ✅ Direct access via link: `https://t.me/yourbot/yourapp`
- ✅ No need to start chat first
- ✅ Shareable link

**Disadvantages**:
- ❌ Less discoverable (users need link)

**BotFather Setup**:
```
/myapps
> Select application
> Choose "Edit link"
> Set URL: https://your-app.vercel.app
```

**Result**: `https://t.me/yourbot/yourapp`

#### Recommendation: Use Both
Configure both methods for maximum reach:
- Menu button for users already interacting with bot
- Direct link for sharing, campaigns, deep links

### Implementation Template
```markdown
# User Access Pattern

## Chosen Method: [Menu Button / Direct Link / Both]

### Menu Button Configuration
- [x] Configured via `/setmenubutton`
- Button Title: "[Your Button Text]"
- URL: https://[your-domain]

### Direct Link Configuration
- [x] Configured via `/myapps`
- Direct Link: https://t.me/[botname]/[appname]
- URL: https://[your-domain]

## Deep Linking Strategy
- Referrals: `https://t.me/[bot]/[app]?startapp=REF_123`
- Entity Links: `https://t.me/[bot]/[app]?startapp=ITEM_456`
```

---

## Phase 0 Checklist

Before proceeding to Phase 1, ensure you have:

- [ ] ✅ Documented MVP scope (one-page product brief)
- [ ] ✅ Identified target platforms (Android, iOS, Web, Desktop)
- [ ] ✅ Defined feature set & integrations:
  - [ ] Authentication (init data validation)
  - [ ] TON Connect (if needed)
  - [ ] Payments (Telegram Stars, if needed)
  - [ ] Storage strategy (CloudStorage/DeviceStorage/SecureStorage)
  - [ ] Deep linking (start parameters, if needed)
- [ ] ✅ Created security & data flow architecture
- [ ] ✅ Chosen hosting platform (Vercel recommended)
- [ ] ✅ Decided on user access pattern (Menu Button / Direct Link / Both)

**Next Step**: Proceed to [Phase 1: Local Environment Setup](#phase-1-local-environment-setup)

---

# Phase 1: Local Environment Setup

## Overview

**Purpose**: Set up your local development environment to work with the existing `nextjs-template` repository, understand its structure, and prepare for Telegram Mini Apps development.

**Why This Phase Matters**:
- The template uses **PNPM exclusively** (other package managers will fail)
- The template includes a **mock Telegram environment** for local development
- Understanding the template structure prevents confusion later
- Proper environment configuration is critical for security (bot token handling)

**Expected Duration**: 30 minutes - 1 hour

**Key Outcomes**:
- ✅ PNPM installed and verified
- ✅ Dependencies installed successfully
- ✅ Dev server running (`pnpm run dev`)
- ✅ Understanding of mock environment (`mockEnv.ts`)
- ✅ `.env.local` configured with placeholders
- ✅ Linting passing (`pnpm run lint`)

---

## Step 1: Install PNPM (Required)

### What to Do
Install PNPM package manager, as the template **requires** it.

### Why PNPM is Required
From the template's `README.md`:
> "The template was created using pnpm. Therefore, it is required to use it for this project as well. Using other package managers, you will receive a corresponding error."

**Technical Reason**: The template's `pnpm-lock.yaml` ensures exact dependency versions. Using npm or yarn will cause dependency resolution conflicts.

### Installation Guide

#### Option 1: Via NPM (Recommended)
```bash
npm install -g pnpm
```

#### Option 2: Via Standalone Script (Alternative)
**Windows (PowerShell)**:
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**macOS/Linux**:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Option 3: Via Homebrew (macOS)
```bash
brew install pnpm
```

### Verification
```bash
pnpm --version
```

**Expected Output**: `9.x.x` or later

---

## Step 2: Verify Node.js Version

### What to Do
Ensure you have a compatible Node.js version installed.

### Required Version
The template uses Next.js 15.3.1, which requires:
- **Node.js**: v18.18.0 or later (v20+ recommended)

### Check Your Version
```bash
node --version
```

**Expected Output**: `v18.18.0` or higher (ideally `v20.x.x`)

### If Node.js is Outdated
**Option 1: Using NVM (Node Version Manager)** - Recommended
```bash
# Install NVM (if not already installed)
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows: Download nvm-windows from
# https://github.com/coreybutler/nvm-windows/releases

# Install and use Node 20
nvm install 20
nvm use 20
```

**Option 2: Download from Official Site**
- Visit: https://nodejs.org/
- Download LTS version (currently v20.x)
- Install and restart terminal

---

## Step 3: Clone or Navigate to Repository

### What to Do
Ensure you're in the `nextjs-template` directory.

**Since you already have the repository**, verify you're in the correct directory:

```bash
cd c:\Users\hp\Desktop\Projects\telegram-mini-app\nextjs-template
```

### Verify Repository Structure
```bash
# List key files/folders
ls
```

**Expected Output**:
```
.eslintrc.json
.gitignore
next.config.ts
package.json
pnpm-lock.yaml
README.md
tailwind.config.ts
tsconfig.json
src/
public/
docs/
```

---

## Step 4: Install Dependencies

### What to Do
Install all project dependencies using PNPM.

### Command
```bash
pnpm install
```

### What This Does
PNPM reads `package.json` and `pnpm-lock.yaml` to install exact versions of:

**Core Dependencies** (from `package.json`):
```json
{
  "@telegram-apps/sdk-react": "^3.2.4",  // Main Telegram Mini Apps SDK
  "@telegram-apps/telegram-ui": "^2.1.5", // Telegram UI components
  "@tonconnect/ui-react": "^2.1.0",      // TON wallet integration
  "next": "15.3.1",                       // Next.js framework
  "next-intl": "^4.1.0",                  // Internationalization
  "react": "^18",                         // React library
  "react-dom": "^18"                      // React DOM
}
```

**Dev Dependencies**:
```json
{
  "typescript": "^5",                     // TypeScript compiler
  "eslint": "^8",                         // Code linting
  "eslint-config-next": "14.2.4",        // Next.js ESLint config
  "tailwindcss": "^3.4.1"                // CSS framework
}
```

### Expected Output
```
Packages: +XXX
++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done

dependencies:
+ @telegram-apps/sdk-react 3.2.4
+ @telegram-apps/telegram-ui 2.1.5
+ @tonconnect/ui-react 2.1.0
...

Done in Xs
```

### Troubleshooting

#### Error: "Cannot find module 'pnpm'"
**Solution**: PNPM not installed or not in PATH
```bash
npm install -g pnpm
```

#### Error: "Lockfile is up to date, resolution step is skipped"
**This is normal** - means dependencies already match lock file.

#### Error: Network timeout
**Solution**: Check internet connection or try again:
```bash
pnpm install --force
```

---

## Step 5: Understand the Mock Environment

### What to Do
Learn how the template simulates Telegram environment for local development.

### Why This Exists
From the template README:
> "Some libraries in this template, such as `@telegram-apps/sdk`, are not intended for use outside of Telegram. Nevertheless, they appear to function properly. This is because the `src/hooks/useTelegramMock.ts` file, which is imported in the application's `Root` component, employs the `mockTelegramEnv` function to simulate the Telegram environment."

### Location
**File**: `src/mockEnv.ts`

### How It Works

#### Step 1: Read the Mock Environment File
```bash
# Open and read the file
cat src/mockEnv.ts
```

**Or use your code editor**: Open `src/mockEnv.ts` in VS Code.

**Key Code** (simplified explanation):
```typescript
import { mockTelegramEnv, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

// This function simulates Telegram's launch parameters
mockTelegramEnv({
  themeParams: {
    accentTextColor: '#6ab2f2',
    bgColor: '#17212b',
    // ... other theme colors
  },
  initData: parseInitData(initDataRaw), // Parses fake init data
  initDataRaw,  // Raw simulated init data string
  version: '7.2', // Simulated Telegram app version
  platform: 'tdesktop', // Simulated platform
});
```

**What This Does**:
1. **Fakes launch parameters**: Provides `tgWebAppVersion`, `tgWebAppPlatform`, `tgWebAppThemeParams`, etc.
2. **Fakes init data**: Simulates user information (id, username, etc.)
3. **Allows SDK usage**: Tricks `@telegram-apps/sdk` into thinking it's running in Telegram

#### Step 2: Locate Where It's Used
**File**: `src/components/Root/Root.tsx`

```typescript
import { init } from '@/core/init.ts';

// During component initialization
useEffect(() => {
  init({
    debug: true,
    eruda: false,
    mockForMacOS: true, // <-- Enables mock on macOS
  });
}, []);
```

**File**: `src/core/init.ts`

```typescript
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Initialize SDK
  initSDK();

  // Mock environment if needed
  if (options.mockForMacOS) {
    const { mockTelegramEnv } = await import('@/mockEnv');
    mockTelegramEnv();
  }
  
  // ... rest of initialization
}
```

### Critical Security Note

**⚠️ NEVER USE MOCK IN PRODUCTION**

The mock environment must be **disabled in production** because:
- ❌ Fakes user authentication (security vulnerability)
- ❌ Provides invalid init data (server validation will fail)
- ❌ Breaks real Telegram features

**How to Disable for Production**:
```typescript
// In src/core/init.ts
const shouldMock = process.env.NODE_ENV === 'development' && options.mockForMacOS;

if (shouldMock) {
  const { mockTelegramEnv } = await import('@/mockEnv');
  mockTelegramEnv();
}
```

**Or conditionally in Root.tsx**:
```typescript
useEffect(() => {
  init({
    debug: process.env.NODE_ENV === 'development',
    eruda: false,
    mockForMacOS: process.env.NODE_ENV === 'development', // Only in dev
  });
}, []);
```

## Step 7: Run Development Server with HTTPS

### What to Do
Test the app with HTTPS (required for real Telegram testing).

### Why HTTPS is Needed
From Telegram docs:
> "To run the application inside Telegram, @BotFather requires an HTTPS link."

The template provides a **self-signed SSL certificate** for local HTTPS testing.

### Command
```bash
pnpm run dev:https
```

**What This Does**: Runs `next dev --experimental-https`

### Expected Output
```
▲ Next.js 15.3.1
- Local:        https://localhost:3000

⚠ Using experimental HTTPS server
✓ Starting...
✓ Ready in 2.4s
```

### Browser Warning (Expected)

When visiting **https://localhost:3000**, you'll see:

**Chrome**:
```
Your connection is not private
NET::ERR_CERT_AUTHORITY_INVALID
```
**This is NORMAL** - it's a self-signed certificate.

### How to Proceed
1. **Chrome**: Click "Advanced" → "Proceed to localhost (unsafe)"
2. **Firefox**: Click "Advanced" → "Accept the Risk and Continue"

### Use 127.0.0.1 for BotFather

**Important**: When configuring BotFather later, use:
```
https://127.0.0.1:3000
```

**NOT** `https://localhost:3000` (BotFather rejects `localhost`)

---

## Step 8: Configure ESLint

### What to Do
Verify that code quality checks (ESLint) are working.

### Why This Matters
ESLint catches common mistakes and enforces code style consistency across the project.

### Command
```bash
pnpm run lint
```

**What This Does**: Runs `next lint` (from `package.json`)

### Expected Output (Clean)
```
✔ No ESLint warnings or errors
```

### If Errors Found
**Example Error**:
```
./src/app/page.tsx
5:1  Error: 'useState' is defined but never used  @typescript-eslint/no-unused-vars
```

**Fix Manually**: Remove unused imports/variables

**Or Auto-Fix** (if possible):
```bash
pnpm run lint -- --fix
```

### ESLint Configuration
**File**: `.eslintrc.json`

```json
{
  "extends": "next/core-web-vitals"
}
```

This uses Next.js's recommended ESLint config, which includes:
- React best practices
- Next.js specific rules
- Accessibility checks

---

## Step 9: Configure Environment Variables

### What to Do
Create a `.env.local` file for environment-specific configuration.

### Why This Matters
Environment variables store sensitive data (like bot token) and environment-specific URLs. **Never commit these to git**.

```bash
# ============================================
# TELEGRAM BOT CONFIGURATION
# ============================================
# Your bot token from @BotFather
# SECURITY: Keep this SECRET! Never commit to git.
# Format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_TOKEN=your_bot_token_here

# ============================================
# API & BACKEND CONFIGURATION
# ============================================
# Base URL for your backend API
# Development: http://localhost:3000/api
# Production: https://your-domain.com/api
API_BASE_URL=http://localhost:3000/api

# ============================================
# DATABASE CONFIGURATION (if using)
# ============================================
# PostgreSQL connection string
# Format: postgresql://user:password@host:port/database
# Example: postgresql://postgres:password@localhost:5432/miniapp_db
# DATABASE_URL=postgresql://user:password@localhost:5432/miniapp_db

# ============================================
# TON CONNECT CONFIGURATION (if using)
# ============================================
# URL to your TON Connect manifest.json
# Must be publicly accessible HTTPS URL in production
# Development: Can use localhost
NEXT_PUBLIC_TON_MANIFEST_URL=http://localhost:3000/tonconnect-manifest.json

# ============================================
# ENVIRONMENT
# ============================================
# Node environment: development | production | test
NODE_ENV=development

# ============================================
# OPTIONAL: FEATURE FLAGS
# ============================================
# Enable/disable features
NEXT_PUBLIC_ENABLE_TON_CONNECT=true
NEXT_PUBLIC_ENABLE_PAYMENTS=false
```

#### 3. Verify `.gitignore` Includes `.env.local`
**File**: `.gitignore`

Should contain:
```gitignore
# local env files
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**✅ Confirmed**: The template already includes this.

#### 4. Access Environment Variables in Code

**Server-Side** (API routes, server components):
```typescript
// src/app/api/auth/route.ts
const botToken = process.env.BOT_TOKEN; // Accessible server-side only
```

**Client-Side** (browser code):
```typescript
// Must use NEXT_PUBLIC_ prefix
const tonManifestUrl = process.env.NEXT_PUBLIC_TON_MANIFEST_URL;
```

**⚠️ CRITICAL**: 
- Variables **without** `NEXT_PUBLIC_` prefix are **server-side only**
- **NEVER** expose `BOT_TOKEN` in client code (don't add `NEXT_PUBLIC_` prefix)

---

#### 5. **TON Connect Page** (`/ton-connect`)
**File**: `src/app/ton-connect/page.tsx`

**What It Shows**:
- TON wallet connection button
- Connected wallet address
- Disconnect functionality

**Key Learning**: TON Connect integration (if you need blockchain features)

---

## Phase 1 Checklist

Before proceeding to Phase 2, ensure you have:

<!-- - [ ] ✅ PNPM installed and verified (`pnpm --version`) -->
<!-- - [ ] ✅ Node.js v18.18+ installed (`node --version`) -->
<!-- - [ ] ✅ Dependencies installed (`pnpm install`) -->
<!-- - [ ] ✅ Dev server runs successfully (`pnpm run dev`) -->
<!-- - [ ] ✅ HTTPS dev server works (`pnpm run dev:https`) -->
<!-- - [ ] ✅ Understanding of mock environment (`src/mockEnv.ts`)
  - [ ] Know where it's used (`src/core/init.ts`)
  - [ ] Know to disable in production -->
<!-- - [ ] ✅ `.env.local` created with placeholders -->
<!-- - [ ] ✅ ESLint passing (`pnpm run lint`) -->
<!-- - [ ] ✅ Explored demo pages: -->
  <!-- - [ ] Init Data page
  - [ ] Launch Params page
  - [ ] Theme Params page
  - [ ] TON Connect page
- [ ] ✅ Understand project structure (key files & folders) -->

## Reference Links

### Official Documentation
- **Telegram Mini Apps Platform**: https://docs.telegram-mini-apps.com/
- **@telegram-apps/sdk**: https://github.com/Telegram-Mini-Apps/tma.js
- **Next.js Docs**: https://nextjs.org/docs
- **PNPM Docs**: https://pnpm.io/

### Template Repository
- **Next.js Template**: https://github.com/Telegram-Mini-Apps/nextjs-template
- **Template README**: [README.md](../README.md)

### Related Packages
- **@telegram-apps/sdk-react**: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react
- **TON Connect**: https://docs.ton.org/develop/dapps/ton-connect/overview

---

## Next Steps

**Phase 0 & 1 Complete!** 🎉

You now have:
- ✅ Clearly defined project scope and architecture
- ✅ Fully functioning local development environment
- ✅ Understanding of the template structure
- ✅ Knowledge of how the mock environment works

**Ready for Phase 2**: Bot & Mini App Registration (Test Environment)

In Phase 2, you will:
1. Switch to Telegram test environment
2. Create a test bot via BotFather
3. Register a Mini App entity
4. Configure access methods (Menu Button / Direct Link)
5. Test your local app inside Telegram

**Please confirm you're ready to proceed to Phase 2, and I'll prepare the detailed implementation guide for the next phase.**

---

**End of Phase 0 & 1 Implementation Guide**



# PlateWise: Full-Stack Auth + Role-Based Restaurant/Consumer Platform

## Overview

Transform PlateWise from a consumer-only app into a full dual-sided marketplace with real OAuth authentication and complete restaurant management pages. Users choose their role at signup and see only relevant screens.

---

## Part 1: Real Authentication (Google, Apple, Phone)

### 1A. Google & Apple OAuth
- Use Lovable Cloud's managed OAuth (no API keys needed from you for Google/Apple -- they work out of the box)
- Run the "Configure Social Login" tool to generate the `src/integrations/lovable` module
- Update `SocialLogins.tsx` to call `lovable.auth.signInWithOAuth("google")` and `lovable.auth.signInWithOAuth("apple")` instead of showing toast demos
- Remove Facebook button (not natively supported), keep Google + Apple
- Social login will pass `user_type` via redirect URL params or prompt after first login

### 1B. Phone (SMS) Auth
- Lovable Cloud supports phone auth natively
- Add a "Sign in with Phone" option using `supabase.auth.signInWithOtp({ phone })`
- Build a phone input + OTP verification UI component
- Configure phone auth via the Cloud auth settings tool

### 1C. Post-Social-Login Role Selection
- For social/phone signups, users won't have picked a role yet
- Create a `RoleSelectionPage` that appears on first login if no `user_type` is set in user metadata
- Store role in `auth.users` metadata AND in a `user_roles` table (security best practice)
- AuthContext checks for role and redirects to role selection if missing

---

## Part 2: Role-Based Routing & Navigation

### 2A. User Roles Table
- Create `user_roles` table with RLS (per security guidelines)
- Create `has_role()` security definer function
- Populate role on signup or role selection

### 2B. Conditional Navigation
- **Consumer**: Sees homepage, discover, cart, checkout, orders, wallet, profile settings
- **Restaurant Owner**: Sees restaurant dashboard, order management, listings, analytics, profile settings
- Update `Header.tsx` to show different nav items based on role
- Update `BottomNav.tsx` to show role-specific tabs
- Add route guards: restaurant pages require business role, consumer pages open to all

### 2C. Role Switcher
- Allow users who signed up as one role to request the other (future enhancement, out of scope for now)

---

## Part 3: Restaurant-Side Pages (All New)

### 3A. Restaurant Dashboard (Redesign `BusinessDashboard.tsx`)
- Real-time order feed with incoming/active/completed tabs
- Summary cards: today's orders, today's revenue, items saved, pickup rate
- Quick actions: add listing, view analytics, manage profile
- Enable Supabase realtime on `orders` table for live updates

### 3B. Order Management Page (New: `RestaurantOrders.tsx`)
- Full order list with filters (pending, confirmed, picked up, cancelled)
- Order detail view: customer info (anonymous), items, pickup code, time
- Actions: confirm order, mark picked up, cancel with reason
- Sound/visual notification for new incoming orders

### 3C. Menu/Listing Management (Redesign `MyListings.tsx` + `CreateListing.tsx`)
- Replace mock data with real DB queries from `listings` table (need to create this table)
- CRUD operations: create, edit, duplicate, delete, toggle active/inactive
- Bulk actions: mark all as sold out, deactivate expired
- Image upload to storage bucket
- Real-time quantity tracking

### 3D. Analytics Dashboard (New: `RestaurantAnalytics.tsx`)
- Revenue over time (daily/weekly/monthly charts)
- Top-selling items
- Total food saved from waste (kg/items)
- Customer trends (repeat vs new)
- CO2 impact estimate
- Use chart components (recharts already in dependencies)

### 3E. Restaurant Profile & Settings (Redesign `BusinessProfileSetup.tsx`)
- Functional profile with real DB persistence (create `business_profiles` table)
- Business hours editor (day-by-day)
- Logo upload to storage
- Contact info, address with map preview
- Bank/payout details section (UI only for portfolio)

---

## Part 4: Database Changes

### New Tables Needed:
1. **`user_roles`** - role enum (consumer, business), user_id, with RLS + `has_role()` function
2. **`business_profiles`** - business_name, type, address, lat/lng, phone, website, logo_url, hours (JSONB), user_id
3. **`listings`** - title, description, item_type, original_price, discounted_price, quantity, images, pickup_start/end, dietary_info, allergen_info, business_id, status, is_active

### Existing Tables Modified:
- `orders` - add foreign key to `listings` table, add `business_id` column for restaurant filtering

### Realtime:
- Enable realtime on `orders` table for restaurant dashboard

---

## Part 5: Updated Auth Flow

```text
User opens app
  ├─ Not logged in → See homepage (browse-only)
  │   ├─ Click Sign Up → Modal with:
  │   │   ├─ Email/Password + Role selector (Consumer / Restaurant)
  │   │   ├─ Google OAuth
  │   │   ├─ Apple OAuth
  │   │   └─ Phone (SMS OTP)
  │   └─ Click Log In → Modal with same options (minus role)
  │
  └─ Logged in
      ├─ Has role? 
      │   ├─ Consumer → Consumer nav + pages
      │   └─ Business → Restaurant nav + pages
      └─ No role? → RoleSelectionPage → then redirect
```

---

## Implementation Order

1. **Database migrations** - user_roles, business_profiles, listings tables
2. **Auth upgrades** - Google OAuth, Apple OAuth, Phone OTP, role selection page
3. **Role-based routing** - AuthContext updates, route guards, conditional nav
4. **Restaurant dashboard** - real order management with realtime
5. **Listings management** - CRUD with real DB
6. **Analytics page** - charts with real order data
7. **Restaurant profile** - functional form with storage uploads

---

## Technical Notes

- Google & Apple OAuth use Lovable Cloud managed credentials (no keys needed from you)
- Phone auth uses Lovable Cloud's native SMS support
- Microsoft auth skipped for now (not natively supported)
- Facebook button removed (not supported in Lovable Cloud)
- All restaurant pages will have the back-button `PageHeader` component
- Charts use recharts (already installed)
- Role stored in dedicated `user_roles` table per security guidelines (never on profiles table)


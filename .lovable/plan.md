

## Missing Features Analysis for PlateWise Portfolio Project

Based on a thorough review of the codebase, here's what's built vs. what's missing, followed by a prioritized plan.

### What's Already Built
- Homepage with listings, categories, location-based sorting
- Discover page with search, filters, sort
- Listing detail with reviews, map, allergens
- Checkout flow with order creation in database
- Payment page (mock)
- Stripe integration for card management & subscriptions
- Rewards/points system with tiers
- Wallet with transaction history
- Profile with order history & settings drawer
- Favorites (local storage)
- Auth (signup/login)
- Business dashboard (basic), listing creation
- Various settings pages (notifications, account, vouchers, etc.)

### Key Missing Features (Priority Order)

**1. Real-time Cart System (Currently All Mock Data)**
The Cart page uses hardcoded items. There's no way to actually add items from listings to the cart. This is a core e-commerce flow gap.

**2. Ratings & Reviews System**
Reviews are hardcoded in mock data. Users can't leave reviews after picking up orders. This is a key social proof feature.

**3. Business Order Management**
Businesses have no way to see incoming orders, confirm them, or mark them as picked up. The business dashboard is a skeleton.

**4. Search on Homepage**
The search icon in the header navigates to Discover, but the homepage itself lacks prominent search. The Discover page search only filters mock data.

**5. User Profile Photo Upload**
Account details page has no avatar/photo upload functionality.

**6. Dark/Light Theme Toggle**
ThemeProvider exists but there's no visible toggle for users.

**7. Map View on Discover**
The Discover page has a map/list toggle but the map view likely just shows a placeholder.

**8. Loading States & Error Boundaries**
Many pages lack proper loading states for database queries and error handling.

---

### Recommended Build Plan (Top 4 High-Impact Features)

#### Step 1: Functional Cart System
- Create a `CartContext` that persists cart items (localStorage or database)
- Add "Add to Cart" button on ListingDetail page
- Update Cart page to use real cart state instead of mock data
- Connect cart to checkout flow
- Show cart item count badge on cart icon

#### Step 2: Ratings & Reviews System
- Create `reviews` table in database (user_id, listing_id, rating, comment, created_at)
- Add review submission form on ListingDetail (only for users who completed an order)
- Display real reviews instead of mock data
- Calculate and display average ratings

#### Step 3: Business Order Management Dashboard
- Redesign BusinessDashboard with real order data from the `orders` table
- Add order status management (confirm, mark picked up)
- Show analytics: total orders, revenue, items saved from waste
- Real-time updates when new orders come in

#### Step 4: Profile Photo Upload & Account Editing
- Create `profiles` table for user metadata
- Add image upload using storage
- Make AccountDetails form functional with real save/update
- Display user avatar in header and profile page

### Technical Notes
- Cart context will use localStorage for guest users, database for logged-in users
- Reviews table needs RLS policies scoped to authenticated users
- Business dashboard needs a way to identify which user owns which business (business_profiles table)
- Profile photos stored in cloud storage with public URLs


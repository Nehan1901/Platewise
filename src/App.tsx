import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import HouseholdDashboard from "./pages/HouseholdDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessProfileSetup from "./pages/BusinessProfileSetup";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import ListingDetail from "./pages/ListingDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import AccountDetails from "./pages/AccountDetails";
import Vouchers from "./pages/Vouchers";
import Notifications from "./pages/Notifications";
import InviteFriends from "./pages/InviteFriends";
import RecommendStore from "./pages/RecommendStore";
import HelpWithOrder from "./pages/HelpWithOrder";
import HowItWorks from "./pages/HowItWorks";
import Careers from "./pages/Careers";
import HiddenStores from "./pages/HiddenStores";
import Legal from "./pages/Legal";
import RoleSelection from "./pages/RoleSelection";
import RestaurantOrders from "./pages/RestaurantOrders";
import RestaurantAnalytics from "./pages/RestaurantAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/select-role" element={<RoleSelection />} />
                <Route path="/dashboard-household" element={<HouseholdDashboard />} />
                <Route path="/dashboard-business" element={<BusinessDashboard />} />
                <Route path="/business-profile" element={<BusinessProfileSetup />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/restaurant-orders" element={<RestaurantOrders />} />
                <Route path="/restaurant-analytics" element={<RestaurantAnalytics />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account" element={<AccountDetails />} />
                <Route path="/vouchers" element={<Vouchers />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/invite" element={<InviteFriends />} />
                <Route path="/recommend" element={<RecommendStore />} />
                <Route path="/help" element={<HelpWithOrder />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/hidden-stores" element={<HiddenStores />} />
                <Route path="/legal" element={<Legal />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

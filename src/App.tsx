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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route
                  path="/dashboard-household"
                  element={<HouseholdDashboard />}
                />
                <Route
                  path="/dashboard-business"
                  element={<BusinessDashboard />}
                />
                <Route path="/business-profile" element={<BusinessProfileSetup />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;



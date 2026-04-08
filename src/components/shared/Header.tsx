import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Moon,
  Sun,
  Search,
  MapPin,
  ChevronDown,
  User,
  ShoppingCart,
  LayoutDashboard,
  Package,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  locationName?: string | null;
  showLocation?: boolean;
}

const Header = ({ locationName, showLocation = false }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user, userRole } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="py-3 px-4 md:px-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="flex justify-between items-center gap-3">
        {/* Logo */}
        <Link to={userRole === "business" ? "/dashboard-business" : "/"} className="flex items-center gap-2 group shrink-0">
          <Leaf className="h-6 w-6 text-primary transition-transform duration-300 ease-in-out group-hover:rotate-12" />
          <span className="text-xl font-bold font-sans hidden sm:inline tracking-tight">PlateWise</span>
        </Link>

        {/* Location - Center (consumer only) */}
        {showLocation && userRole !== "business" && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium truncate max-w-[120px] md:max-w-[180px] font-sans">
              {locationName || "Set location"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}

        {/* Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Business-specific desktop nav */}
          {userRole === "business" && (
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard-business")} className="text-sm font-sans">
                <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-listings")} className="text-sm font-sans">
                <Package className="h-4 w-4 mr-1" /> Listings
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/restaurant-orders")} className="text-sm font-sans">
                <ClipboardList className="h-4 w-4 mr-1" /> Orders
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/restaurant-analytics")} className="text-sm font-sans">
                <BarChart3 className="h-4 w-4 mr-1" /> Analytics
              </Button>
            </div>
          )}

          {/* Consumer: Search + Cart */}
          {userRole !== "business" && (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate("/discover")} className="rounded-full h-9 w-9">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="rounded-full h-9 w-9 relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans">
                    {totalItems}
                  </span>
                )}
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Menu / Auth */}
          {user ? (
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="rounded-full h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <AuthModal mode="login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-sans">Log In</Button>
              </AuthModal>
              <AuthModal mode="signup">
                <Button size="sm" className="rounded-full font-sans">Sign Up</Button>
              </AuthModal>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

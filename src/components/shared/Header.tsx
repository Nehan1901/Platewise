import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Moon, 
  Sun, 
  Search, 
  MapPin, 
  ChevronDown, 
  User
} from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  locationName?: string | null;
  showLocation?: boolean;
}

const Header = ({ locationName, showLocation = false }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="py-3 px-4 md:px-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <UtensilsCrossed className="h-6 w-6 text-primary transition-transform duration-300 ease-in-out group-hover:rotate-12" />
          <span className="text-xl font-bold hidden sm:inline">PlateWise</span>
        </Link>

        {/* Location - Center */}
        {showLocation && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium truncate max-w-[120px] md:max-w-[180px]">
              {locationName || "Set location"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}

        {/* Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Search/Discover icon for quick access */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/discover")}
            className="rounded-full h-9 w-9"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu / Auth */}
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="rounded-full h-9 w-9"
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <AuthModal mode="login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
              </AuthModal>
              <AuthModal mode="signup">
                <Button size="sm">Sign Up</Button>
              </AuthModal>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
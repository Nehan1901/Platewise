import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Moon, 
  Sun, 
  Search, 
  MapPin, 
  ChevronDown, 
  Heart,
  User,
  Compass,
  ClipboardList,
  LogOut,
  X
} from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  locationName?: string | null;
  showLocation?: boolean;
}

const Header = ({ locationName, showLocation = false }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setSidebarOpen(false);
      navigate("/");
    }
  };

  const navItems = [
    { icon: Search, label: "Browse", path: "/" },
    { icon: Compass, label: "Discover", path: "/discover" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: ClipboardList, label: "Orders", path: "/orders" },
  ];

  const navigateTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
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
          {/* Desktop nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
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
              onClick={() => navigate("/favorites")}
              className="rounded-full h-9 w-9"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
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
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                >
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Welcome!</p>
                      <p className="text-sm text-muted-foreground font-normal truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <Separator className="my-4" />
                
                {/* Navigation Items */}
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigateTo(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                          "hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                <Separator className="my-4" />
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </SheetContent>
            </Sheet>
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
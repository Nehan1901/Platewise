import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Moon, Sun } from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "@/components/theme-provider";

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <UtensilsCrossed className="h-6 w-6 text-primary transition-transform duration-300 ease-in-out group-hover:rotate-12" />
          <span className="text-xl font-bold">PlateWise</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <AuthModal mode="login">
            <Button variant="ghost">Log In</Button>
          </AuthModal>
          <AuthModal mode="signup">
            <Button>Sign Up</Button>
          </AuthModal>
        </nav>
      </div>
    </header>
  );
};

export default Header;

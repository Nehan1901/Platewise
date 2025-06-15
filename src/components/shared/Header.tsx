
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

const Header = () => {
  return (
    <header className="py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PlateWise</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

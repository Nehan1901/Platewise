import { Input } from "@/components/ui/input";
import { Search, Leaf } from "lucide-react";
import LocationSelector from "./LocationSelector";

interface HeroSectionProps {
  locationName: string | null;
  locationLoading: boolean;
  locationError: string | null;
  onRequestLocation: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HeroSection = ({
  locationName,
  locationLoading,
  locationError,
  onRequestLocation,
  searchQuery,
  onSearchChange,
}: HeroSectionProps) => {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            <Leaf className="h-4 w-4" />
            Reduce food waste, save money
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Rescue delicious food
            <span className="text-primary"> near you</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Discover surplus meals and groceries from local restaurants and stores at up to 70% off.
          </p>

          <div className="pt-4 flex justify-center">
            <LocationSelector
              locationName={locationName}
              loading={locationLoading}
              error={locationError}
              onRequestLocation={onRequestLocation}
            />
          </div>
        </div>

        <div className="relative mt-8 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for pizza, sushi, bakery..." 
            className="pl-12 h-12 text-base rounded-full border-border/60 shadow-sm focus:border-primary/40 focus:ring-primary/20" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

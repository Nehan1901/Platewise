import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LocationSelector from "./LocationSelector";

interface HeroSectionProps {
  locationName: string | null;
  locationLoading: boolean;
  locationError: string | null;
  onRequestLocation: () => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HeroSection = ({
  locationName,
  locationLoading,
  locationError,
  onRequestLocation,
  onLocationSelect,
  searchQuery,
  onSearchChange,
}: HeroSectionProps) => {
  return (
    <section className="bg-background border-b border-border">
      {/* Location Bar */}
      <div className="px-4 md:px-6 py-3">
        <LocationSelector
          locationName={locationName}
          loading={locationLoading}
          error={locationError}
          onRequestLocation={onRequestLocation}
          onLocationSelect={onLocationSelect}
        />
      </div>
    </section>
  );
};

export default HeroSection;

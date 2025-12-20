import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation } from "lucide-react";

interface LocationSelectorProps {
  locationName: string | null;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
}

const LocationSelector = ({ 
  locationName, 
  loading, 
  error, 
  onRequestLocation 
}: LocationSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRequestLocation}
        disabled={loading}
        className="rounded-full px-4 h-9 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Finding location...
          </>
        ) : locationName ? (
          <>
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{locationName}</span>
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4 mr-2" />
            Enable Location
          </>
        )}
      </Button>
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
};

export default LocationSelector;

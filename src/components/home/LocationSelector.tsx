import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, Navigation, X, Search } from "lucide-react";

interface LocationSelectorProps {
  locationName: string | null;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
  onLocationSelect?: (lat: number, lon: number, name: string) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const LocationSelector = ({ 
  locationName, 
  loading, 
  error, 
  onRequestLocation,
  onLocationSelect,
}: LocationSelectorProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for location suggestions
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        const data = await response.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    // Extract city name from display_name
    const parts = suggestion.display_name.split(", ");
    const cityName = parts[0];
    
    onLocationSelect?.(lat, lon, cityName);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    onRequestLocation();
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {!isSearchOpen ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
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
                Set Location
              </>
            )}
          </Button>
          {error && (
            <span className="text-xs text-destructive">{error}</span>
          )}
        </div>
      ) : (
        <div className="w-72 sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search city or use current location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 rounded-full border-primary/40 focus:border-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSuggestions([]);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
            {/* Use current location option */}
            <button
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border"
            >
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Use current location</span>
            </button>

            {/* Loading state */}
            {searchLoading && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            )}

            {/* Suggestions */}
            {!searchLoading && suggestions.length > 0 && (
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{suggestion.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {!searchLoading && searchQuery.length >= 2 && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

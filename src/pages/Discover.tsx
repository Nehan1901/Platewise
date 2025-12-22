import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, ChevronDown, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DiscoverListingCard from "@/components/discover/DiscoverListingCard";
import BottomNav from "@/components/shared/BottomNav";
import FilterSheet, { FilterState } from "@/components/discover/FilterSheet";
import { useGeolocation, calculateDistance } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "map";
type SortOption = "relevance" | "distance" | "price_low" | "price_high" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "distance", label: "Distance" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

// Mock listings data
const mockListings = [
  {
    id: "1",
    title: "Afternoon Bag",
    original_price: 18.0,
    discounted_price: 5.99,
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=90&w=1200&auto=format&fit=crop",
    business_name: "Jerk Hut - University",
    latitude: 40.7128,
    longitude: -74.006,
    pickup_time: "tomorrow 3:00 PM - 4:00 PM",
    rating: 4.5,
    ending_soon: false,
  },
  {
    id: "2",
    title: "Circle K Treats & Eats",
    original_price: 12.0,
    discounted_price: 3.99,
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=90&w=1200&auto=format&fit=crop",
    business_name: "Circle K - FL - 7474: 908 W. Fletcher Avenue",
    latitude: 40.7148,
    longitude: -74.008,
    pickup_time: "today 10:00 AM - 9:00 PM",
    rating: 4.0,
    ending_soon: true,
  },
  {
    id: "3",
    title: "Bakery Surprise Box",
    original_price: 20.0,
    discounted_price: 6.99,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop",
    business_name: "Circle K - FL - 6539: 14611 Bruce B Downs Blvd",
    latitude: 40.7108,
    longitude: -74.004,
    pickup_time: "today 2:00 PM - 6:00 PM",
    rating: 4.2,
    ending_soon: true,
  },
  {
    id: "4",
    title: "Fresh Sushi Platter",
    original_price: 25.0,
    discounted_price: 12.99,
    image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop",
    business_name: "Sushi Express",
    latitude: 40.7158,
    longitude: -74.002,
    pickup_time: "today 5:00 PM - 8:00 PM",
    rating: 4.7,
    ending_soon: false,
  },
  {
    id: "5",
    title: "Pizza Slice Deal",
    original_price: 15.0,
    discounted_price: 4.99,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop",
    business_name: "Napoli Pizzeria",
    latitude: 40.7138,
    longitude: -74.007,
    pickup_time: "today 6:00 PM - 9:00 PM",
    rating: 4.3,
    ending_soon: false,
  },
];

const Discover = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dietaryPreferences: [],
    priceRange: [0, 50],
    distance: 10,
    pickupTime: "any",
  });
  const { latitude, longitude } = useGeolocation();

  // Calculate distances
  const listingsWithDistance = useMemo(() => {
    return mockListings.map((listing) => {
      let distance: number | undefined;
      if (latitude && longitude) {
        distance = calculateDistance(
          latitude,
          longitude,
          listing.latitude,
          listing.longitude
        );
      }
      return { ...listing, distance };
    });
  }, [latitude, longitude]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const listings = [...listingsWithDistance];
    
    switch (sortBy) {
      case "distance":
        return listings.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
      case "price_low":
        return listings.sort((a, b) => a.discounted_price - b.discounted_price);
      case "price_high":
        return listings.sort((a, b) => b.discounted_price - a.discounted_price);
      case "rating":
        return listings.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return listings;
    }
  }, [listingsWithDistance, sortBy]);

  // Filter by search
  const filteredListings = useMemo(() => {
    if (!searchQuery) return sortedListings;
    const query = searchQuery.toLowerCase();
    return sortedListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.business_name.toLowerCase().includes(query)
    );
  }, [sortedListings, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-background px-4 pt-4 pb-3 space-y-3">
        {/* Search Bar Row */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10 rounded-full shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-border bg-background"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl border-border"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>

        {/* List/Map Toggle */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
              viewMode === "map"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Map
          </button>
        </div>

        {/* Sort Dropdown */}
        {viewMode === "list" && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary font-medium px-2 h-auto py-1">
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(sortBy === option.value && "bg-accent")}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <div className="px-4 space-y-4 pb-4">
          {filteredListings.map((listing) => (
            <DiscoverListingCard key={listing.id} listing={listing} />
          ))}
          
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-secondary">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Map view coming soon</p>
          </div>
        </div>
      )}

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />

      <BottomNav />
    </div>
  );
};

export default Discover;

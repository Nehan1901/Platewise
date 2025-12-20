import { useState, useEffect, useMemo } from "react";
import Header from "@/components/shared/Header";
import HeroSection from "@/components/home/HeroSection";
import ListingsGrid from "@/components/home/ListingsGrid";
import { useGeolocation, calculateDistance } from "@/hooks/useGeolocation";

// Mock listings with location data
const mockListings = [
  {
    id: "1",
    title: "Surprise Pastry Box",
    original_price: 20.0,
    discounted_price: 6.99,
    image_url: `https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop`,
    business_name: "The Corner Bakery",
    latitude: 40.7128,
    longitude: -74.006,
    pickup_time: "6-8 PM",
    items_left: 3,
  },
  {
    id: "2",
    title: "Artisanal Cheese Platter",
    original_price: 25.0,
    discounted_price: 12.5,
    image_url: `https://images.unsplash.com/photo-1627998994246-a41eda1a76b5?q=80&w=1200&auto=format&fit=crop`,
    business_name: "The Gilded Grape",
    latitude: 40.7148,
    longitude: -74.008,
    pickup_time: "7-9 PM",
    items_left: 5,
  },
  {
    id: "3",
    title: "Gourmet Burger & Fries",
    original_price: 18.5,
    discounted_price: 9.25,
    image_url: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Patty's Pub",
    latitude: 40.7108,
    longitude: -74.004,
    pickup_time: "8-10 PM",
    items_left: 2,
  },
  {
    id: "4",
    title: "Spicy Tuna Roll Set",
    original_price: 16.0,
    discounted_price: 8.0,
    image_url: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Sushi Central",
    latitude: 40.7158,
    longitude: -74.002,
    pickup_time: "5-7 PM",
    items_left: 4,
  },
  {
    id: "5",
    title: "Fresh Veggie Box",
    original_price: 22.0,
    discounted_price: 8.99,
    image_url: `https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Green Market Co.",
    latitude: 40.7118,
    longitude: -74.01,
    pickup_time: "4-6 PM",
    items_left: 8,
  },
  {
    id: "6",
    title: "Wood-Fired Pizza Slice",
    original_price: 12.0,
    discounted_price: 4.99,
    image_url: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Napoli Express",
    latitude: 40.7138,
    longitude: -74.007,
    pickup_time: "9-10 PM",
    items_left: 6,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { latitude, longitude, loading, error, requestLocation, setManualLocation, locationName } = useGeolocation();

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Calculate distances and sort by proximity
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
    }).sort((a, b) => {
      if (a.distance === undefined || b.distance === undefined) return 0;
      return a.distance - b.distance;
    });
  }, [latitude, longitude]);

  // Filter by search query
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listingsWithDistance;
    const query = searchQuery.toLowerCase();
    return listingsWithDistance.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.business_name.toLowerCase().includes(query)
    );
  }, [listingsWithDistance, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection
          locationName={locationName}
          locationLoading={loading}
          locationError={error}
          onRequestLocation={requestLocation}
          onLocationSelect={setManualLocation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="container mx-auto px-4 md:px-6">
          <ListingsGrid
            listings={filteredListings}
            title="Available Near You"
            subtitle={latitude ? `Sorted by distance from your location` : "Enable location for personalized results"}
            loading={false}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

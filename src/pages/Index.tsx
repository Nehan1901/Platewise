import { useState, useEffect, useMemo } from "react";
import Header from "@/components/shared/Header";
import HeroSection from "@/components/home/HeroSection";
import CategoryFilters from "@/components/home/CategoryFilters";
import ListingSection from "@/components/home/ListingSection";
import BottomNav from "@/components/shared/BottomNav";
import { useGeolocation, calculateDistance } from "@/hooks/useGeolocation";

// Mock listings with multiple high-quality images
const mockListings = [
  {
    id: "1",
    title: "Surprise Pastry Box",
    original_price: 20.0,
    discounted_price: 6.99,
    image_url: `https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1486427944544-d2c6f7e8c14b?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "The Corner Bakery",
    latitude: 40.7128,
    longitude: -74.006,
    pickup_time: "6-8 PM",
    items_left: 3,
    bag_type: "Evening Bag",
  },
  {
    id: "2",
    title: "Artisanal Cheese Platter",
    original_price: 25.0,
    discounted_price: 12.5,
    image_url: `https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1559561853-08451507cbe7?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "The Gilded Grape",
    latitude: 40.7148,
    longitude: -74.008,
    pickup_time: "7-9 PM",
    items_left: 5,
    bag_type: "Cheese Box",
  },
  {
    id: "3",
    title: "Gourmet Burger & Fries",
    original_price: 18.5,
    discounted_price: 9.25,
    image_url: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1550547660-d9450f859349?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Patty's Pub",
    latitude: 40.7108,
    longitude: -74.004,
    pickup_time: "8-10 PM",
    items_left: 2,
    bag_type: "Dinner Bag",
  },
  {
    id: "4",
    title: "Spicy Tuna Roll Set",
    original_price: 16.0,
    discounted_price: 8.0,
    image_url: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1553621042-f6e147245754?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Sushi Central",
    latitude: 40.7158,
    longitude: -74.002,
    pickup_time: "5-7 PM",
    items_left: 4,
    bag_type: "Sushi Box",
  },
  {
    id: "5",
    title: "Fresh Veggie Box",
    original_price: 22.0,
    discounted_price: 8.99,
    image_url: `https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1506484381205-f7945b9d3108?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1518843875459-f738682238a6?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Green Market Co.",
    latitude: 40.7118,
    longitude: -74.01,
    pickup_time: "4-6 PM",
    items_left: 8,
    bag_type: "Grocery Box",
  },
  {
    id: "6",
    title: "Wood-Fired Pizza Slice",
    original_price: 12.0,
    discounted_price: 4.99,
    image_url: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=90&w=1200&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1513104890138-7c749659a591?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Napoli Express",
    latitude: 40.7138,
    longitude: -74.007,
    pickup_time: "9-10 PM",
    items_left: 6,
    bag_type: "Pizza Box",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  // Split listings into sections
  const topPicks = listingsWithDistance.slice(0, 4);
  const endingSoon = listingsWithDistance.slice(2, 6);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
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
        
        {/* Category Filters */}
        <div className="py-3 bg-background sticky top-0 z-40 border-b border-border">
          <CategoryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        {/* Listing Sections */}
        <div className="space-y-2 py-4">
          <ListingSection
            title="Top picks near you"
            listings={topPicks}
            loading={false}
          />
          
          <ListingSection
            title="Save before it's too late"
            listings={endingSoon}
            badge="Ending soon"
            loading={false}
          />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;

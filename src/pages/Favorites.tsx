import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import ListingCardNew from "@/components/home/ListingCardNew";
import BottomNav from "@/components/shared/BottomNav";

// Mock listings - in a real app this would come from an API
const allListings = [
  {
    id: "1",
    title: "Surprise Pastry Box",
    original_price: 20.0,
    discounted_price: 6.99,
    category: "bread",
    image_url: `https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop`,
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
    category: "groceries",
    image_url: `https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=1200&auto=format&fit=crop`,
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
    category: "meals",
    image_url: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=1200&auto=format&fit=crop`,
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
    category: "sushi",
    image_url: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop`,
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
    category: "groceries",
    image_url: `https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=1200&auto=format&fit=crop`,
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
    category: "pizza",
    image_url: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Napoli Express",
    latitude: 40.7138,
    longitude: -74.007,
    pickup_time: "9-10 PM",
    items_left: 6,
    bag_type: "Pizza Box",
  },
  {
    id: "7",
    title: "Chocolate Cake Surprise",
    original_price: 28.0,
    discounted_price: 12.99,
    category: "desserts",
    image_url: `https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Sweet Delights",
    latitude: 40.7098,
    longitude: -74.003,
    pickup_time: "5-7 PM",
    items_left: 2,
    bag_type: "Dessert Box",
  },
  {
    id: "8",
    title: "Grilled Chicken Meal",
    original_price: 15.0,
    discounted_price: 7.5,
    category: "meals",
    image_url: `https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "The Grill House",
    latitude: 40.7168,
    longitude: -74.009,
    pickup_time: "6-8 PM",
    items_left: 4,
    bag_type: "Dinner Bag",
  },
  {
    id: "9",
    title: "Leftover Sandwich Platter",
    original_price: 18.0,
    discounted_price: 0,
    category: "meals",
    image_url: `https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Deli Express",
    latitude: 40.7188,
    longitude: -74.005,
    pickup_time: "9-10 PM",
    items_left: 2,
    bag_type: "Closing Time Giveaway",
  },
  {
    id: "10",
    title: "Day-Old Croissants",
    original_price: 12.0,
    discounted_price: 0,
    category: "bread",
    image_url: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "French Bakery",
    latitude: 40.7078,
    longitude: -74.011,
    pickup_time: "8-9 PM",
    items_left: 6,
    bag_type: "Free Pastries",
  },
  {
    id: "11",
    title: "Mixed Salad Bowl",
    original_price: 14.0,
    discounted_price: 0,
    category: "meals",
    image_url: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Healthy Bites Cafe",
    latitude: 40.7198,
    longitude: -74.002,
    pickup_time: "7-8 PM",
    items_left: 3,
    bag_type: "Zero Waste Initiative",
  },
  {
    id: "12",
    title: "Closing Time Pizza",
    original_price: 16.0,
    discounted_price: 0,
    category: "pizza",
    image_url: `https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=90&w=1200&auto=format&fit=crop`,
    images: [
      `https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=90&w=1200&auto=format&fit=crop`,
    ],
    business_name: "Tony's Pizzeria",
    latitude: 40.7058,
    longitude: -74.008,
    pickup_time: "10-11 PM",
    items_left: 4,
    bag_type: "Free Before Close",
  },
];

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const favoriteListings = allListings.filter((listing) =>
    favorites.includes(listing.id)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">My Favorites</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {favoriteListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Start exploring and tap the heart icon on listings you love to save them here.
            </p>
            <Button onClick={() => navigate("/discover")}>
              Explore listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteListings.map((listing) => (
              <ListingCardNew key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;

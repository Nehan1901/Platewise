import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  Navigation, 
  Share2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Leaf,
  Users,
  ThumbsUp,
  ThumbsDown,
  Meh
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ListingMap from "@/components/listing/ListingMap";

// Mock listing data (in production, this would come from an API)
const mockListingDetails = {
  "1": {
    id: "1",
    title: "Surprise Pastry Box",
    description: "A delightful assortment of freshly baked pastries including croissants, danishes, muffins, and seasonal specialties. Perfect for breakfast or an afternoon treat!",
    original_price: 20.0,
    discounted_price: 6.99,
    category: "bread",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486427944544-d2c6f7e8c14b?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "The Corner Bakery",
    business_description: "Family-owned bakery since 1985, known for our artisanal breads and pastries made fresh daily.",
    address: "123 Main Street, New York, NY 10001",
    latitude: 40.7128,
    longitude: -74.006,
    phone: "(555) 123-4567",
    pickup_time: "6:00 PM - 8:00 PM",
    pickup_instructions: "Enter through the main door. Show your order confirmation at the counter. Ask for the 'Surprise Box' pickup.",
    items_left: 3,
    rating: 4.7,
    total_reviews: 234,
    bag_type: "Evening Bag",
    ingredients: ["Flour", "Butter", "Sugar", "Eggs", "Milk", "Yeast", "Chocolate", "Fruits"],
    allergens: ["Gluten", "Dairy", "Eggs", "Nuts"],
    customer_images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=90&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509365390695-33aee754301f?q=90&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558326567-98ae2405596b?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Sarah M.", rating: 5, comment: "Amazing variety! Got 6 pastries for less than the price of 2.", date: "2 days ago", sentiment: "positive" },
      { id: 2, user: "John D.", rating: 4, comment: "Good quality, pickup was easy. Would recommend!", date: "1 week ago", sentiment: "positive" },
      { id: 3, user: "Emily R.", rating: 5, comment: "Best surprise bag I've ever gotten. The croissants were fresh!", date: "2 weeks ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.8,
      value: 4.9,
      freshness: 4.6,
      packaging: 4.5,
    }
  },
  "2": {
    id: "2",
    title: "Artisanal Cheese Platter",
    description: "A curated selection of premium cheeses including aged cheddar, brie, gouda, and blue cheese. Served with crackers and seasonal fruits.",
    original_price: 25.0,
    discounted_price: 12.5,
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559561853-08451507cbe7?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "The Gilded Grape",
    business_description: "Premium wine and cheese boutique offering the finest selections from around the world.",
    address: "456 Wine Avenue, New York, NY 10002",
    latitude: 40.7148,
    longitude: -74.008,
    phone: "(555) 234-5678",
    pickup_time: "7:00 PM - 9:00 PM",
    pickup_instructions: "Ring the bell at the side entrance. Have your confirmation code ready.",
    items_left: 5,
    rating: 4.5,
    total_reviews: 156,
    bag_type: "Cheese Box",
    ingredients: ["Aged Cheddar", "Brie", "Gouda", "Blue Cheese", "Crackers", "Grapes", "Honey"],
    allergens: ["Dairy", "Gluten"],
    customer_images: [
      "https://images.unsplash.com/photo-1505575967455-40e256f73376?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Mike T.", rating: 5, comment: "Incredible value for premium cheeses!", date: "3 days ago", sentiment: "positive" },
      { id: 2, user: "Lisa K.", rating: 4, comment: "Great selection, will buy again.", date: "1 week ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.7,
      value: 4.8,
      freshness: 4.4,
      packaging: 4.6,
    }
  },
  "3": {
    id: "3",
    title: "Gourmet Burger & Fries",
    description: "Premium Angus beef burger with house-made brioche bun, secret sauce, fresh vegetables, and a generous portion of crispy fries.",
    original_price: 18.5,
    discounted_price: 9.25,
    category: "meals",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "Patty's Pub",
    business_description: "Classic American pub serving the best burgers in town since 1995.",
    address: "789 Burger Lane, New York, NY 10003",
    latitude: 40.7108,
    longitude: -74.004,
    phone: "(555) 345-6789",
    pickup_time: "8:00 PM - 10:00 PM",
    pickup_instructions: "Enter through the main entrance. Head to the bar and mention 'PlateWise pickup'.",
    items_left: 2,
    rating: 4.8,
    total_reviews: 412,
    bag_type: "Dinner Bag",
    ingredients: ["Angus Beef", "Brioche Bun", "Lettuce", "Tomato", "Onion", "Pickles", "Cheese", "Potatoes"],
    allergens: ["Gluten", "Dairy", "Soy"],
    customer_images: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=90&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Tom B.", rating: 5, comment: "Best burger deal ever! Still hot when I got it.", date: "1 day ago", sentiment: "positive" },
      { id: 2, user: "Anna S.", rating: 5, comment: "Fries were crispy, burger was juicy. Perfect!", date: "4 days ago", sentiment: "positive" },
      { id: 3, user: "Chris P.", rating: 4, comment: "Good portion size for the price.", date: "1 week ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.9,
      value: 4.8,
      freshness: 4.7,
      packaging: 4.5,
    }
  },
  "4": {
    id: "4",
    title: "Spicy Tuna Roll Set",
    description: "Fresh spicy tuna rolls made with premium sushi-grade tuna, perfectly seasoned rice, and our signature spicy mayo. Includes 12 pieces.",
    original_price: 16.0,
    discounted_price: 8.0,
    category: "sushi",
    images: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "Sushi Central",
    business_description: "Authentic Japanese sushi restaurant with master chefs from Tokyo.",
    address: "321 Sushi Street, New York, NY 10004",
    latitude: 40.7158,
    longitude: -74.002,
    phone: "(555) 456-7890",
    pickup_time: "5:00 PM - 7:00 PM",
    pickup_instructions: "Pick up at the sushi bar counter. Ask for your order by name.",
    items_left: 4,
    rating: 4.6,
    total_reviews: 289,
    bag_type: "Sushi Box",
    ingredients: ["Sushi Rice", "Tuna", "Nori", "Spicy Mayo", "Sesame Seeds", "Cucumber", "Avocado"],
    allergens: ["Fish", "Soy", "Sesame", "Eggs"],
    customer_images: [
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Yuki M.", rating: 5, comment: "Fresh fish, great rice texture!", date: "2 days ago", sentiment: "positive" },
      { id: 2, user: "David L.", rating: 4, comment: "Good value for quality sushi.", date: "5 days ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.7,
      value: 4.8,
      freshness: 4.5,
      packaging: 4.4,
    }
  },
  "5": {
    id: "5",
    title: "Fresh Veggie Box",
    description: "A selection of fresh, locally-sourced vegetables perfect for healthy cooking. Includes seasonal greens, tomatoes, peppers, and more.",
    original_price: 22.0,
    discounted_price: 8.99,
    category: "groceries",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506484381205-f7945b9d3108?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "Green Market Co.",
    business_description: "Farm-to-table organic produce from local farmers within 50 miles.",
    address: "555 Organic Way, New York, NY 10005",
    latitude: 40.7118,
    longitude: -74.01,
    phone: "(555) 567-8901",
    pickup_time: "4:00 PM - 6:00 PM",
    pickup_instructions: "Look for the green pickup station at the front of the store.",
    items_left: 8,
    rating: 4.4,
    total_reviews: 178,
    bag_type: "Grocery Box",
    ingredients: ["Mixed Greens", "Tomatoes", "Bell Peppers", "Carrots", "Zucchini", "Onions", "Herbs"],
    allergens: [],
    customer_images: [
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=90&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Green G.", rating: 5, comment: "So fresh! Made an amazing salad.", date: "1 day ago", sentiment: "positive" },
      { id: 2, user: "Helen W.", rating: 4, comment: "Great variety and quality.", date: "3 days ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.5,
      value: 4.7,
      freshness: 4.8,
      packaging: 4.2,
    }
  },
  "6": {
    id: "6",
    title: "Wood-Fired Pizza Slice",
    description: "Authentic Neapolitan pizza baked in our wood-fired oven at 900°F. Hand-stretched dough, San Marzano tomatoes, fresh mozzarella.",
    original_price: 12.0,
    discounted_price: 4.99,
    category: "pizza",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "Napoli Express",
    business_description: "Bringing authentic Naples-style pizza to New York since 2010.",
    address: "777 Pizza Plaza, New York, NY 10006",
    latitude: 40.7138,
    longitude: -74.007,
    phone: "(555) 678-9012",
    pickup_time: "9:00 PM - 10:00 PM",
    pickup_instructions: "Enter through the takeout window on the left side of the building.",
    items_left: 6,
    rating: 4.9,
    total_reviews: 523,
    bag_type: "Pizza Box",
    ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil", "Sea Salt"],
    allergens: ["Gluten", "Dairy"],
    customer_images: [
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=90&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Marco R.", rating: 5, comment: "Tastes like I'm in Naples! Incredible.", date: "1 day ago", sentiment: "positive" },
      { id: 2, user: "Julia C.", rating: 5, comment: "Best pizza deal in the city!", date: "3 days ago", sentiment: "positive" },
      { id: 3, user: "Bob K.", rating: 4, comment: "Great crust, could use more toppings.", date: "1 week ago", sentiment: "neutral" },
    ],
    rating_breakdown: {
      taste: 4.9,
      value: 4.9,
      freshness: 4.8,
      packaging: 4.7,
    }
  },
  "7": {
    id: "7",
    title: "Chocolate Cake Surprise",
    description: "Decadent triple chocolate layer cake with rich ganache frosting. Perfect for chocolate lovers!",
    original_price: 28.0,
    discounted_price: 12.99,
    category: "desserts",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "Sweet Delights",
    business_description: "Artisan bakery specializing in cakes and desserts made with love.",
    address: "888 Dessert Drive, New York, NY 10007",
    latitude: 40.7098,
    longitude: -74.003,
    phone: "(555) 789-0123",
    pickup_time: "5:00 PM - 7:00 PM",
    pickup_instructions: "Pick up at the dessert counter. Refrigerate within 30 minutes.",
    items_left: 2,
    rating: 4.8,
    total_reviews: 345,
    bag_type: "Dessert Box",
    ingredients: ["Dark Chocolate", "Cocoa Powder", "Flour", "Sugar", "Butter", "Eggs", "Heavy Cream"],
    allergens: ["Gluten", "Dairy", "Eggs", "Soy"],
    customer_images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Choco L.", rating: 5, comment: "Heaven in a box! So rich and moist.", date: "2 days ago", sentiment: "positive" },
      { id: 2, user: "Sweet T.", rating: 5, comment: "Best chocolate cake I've ever had.", date: "5 days ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.9,
      value: 4.7,
      freshness: 4.8,
      packaging: 4.6,
    }
  },
  "8": {
    id: "8",
    title: "Grilled Chicken Meal",
    description: "Tender grilled chicken breast with herb marinade, served with roasted vegetables and rice pilaf.",
    original_price: 15.0,
    discounted_price: 7.5,
    category: "meals",
    images: [
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=90&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=90&w=1200&auto=format&fit=crop",
    ],
    business_name: "The Grill House",
    business_description: "Healthy grilled options made fresh daily with premium ingredients.",
    address: "999 Grill Street, New York, NY 10008",
    latitude: 40.7168,
    longitude: -74.009,
    phone: "(555) 890-1234",
    pickup_time: "6:00 PM - 8:00 PM",
    pickup_instructions: "Pick up at the takeout counter near the entrance.",
    items_left: 4,
    rating: 4.5,
    total_reviews: 198,
    bag_type: "Dinner Bag",
    ingredients: ["Chicken Breast", "Herbs", "Olive Oil", "Mixed Vegetables", "Rice", "Garlic", "Lemon"],
    allergens: [],
    customer_images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=90&w=600&auto=format&fit=crop",
    ],
    reviews: [
      { id: 1, user: "Healthy H.", rating: 5, comment: "Perfect portion, delicious and healthy!", date: "1 day ago", sentiment: "positive" },
      { id: 2, user: "Fit F.", rating: 4, comment: "Great for meal prep. Good macros!", date: "4 days ago", sentiment: "positive" },
    ],
    rating_breakdown: {
      taste: 4.6,
      value: 4.7,
      freshness: 4.5,
      packaging: 4.3,
    }
  },
};

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const listing = mockListingDetails[id as keyof typeof mockListingDetails];

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const discount = Math.round(((listing.original_price - listing.discounted_price) / listing.original_price) * 100);

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`,
      "_blank"
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Background Hero Image */}
      <div className="fixed inset-x-0 top-0 h-72 z-0">
        <img
          src={listing.images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Image Carousel Controls */}
        {listing.images.length > 1 && (
          <>
            <button
              onClick={goToPrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {listing.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all shadow-sm",
                    idx === currentImageIndex ? "bg-white w-6" : "bg-white/60 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Discount Badge */}
        <Badge className="absolute top-16 left-4 bg-primary text-primary-foreground shadow-lg">
          {discount}% OFF
        </Badge>
      </div>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg"
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-primary text-primary")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Scrollable Content Card */}
      <div className="relative z-10 mt-56 pb-28">
        <div className="bg-background rounded-t-3xl shadow-2xl min-h-screen">
          <div className="p-5 space-y-6">
            {/* Drag Handle */}
            <div className="flex justify-center">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <p className="text-muted-foreground">{listing.business_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground line-through">
                ${listing.original_price.toFixed(2)}
              </p>
              <p className="text-2xl font-bold text-primary">
                ${listing.discounted_price.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating text-rating" />
              <span className="font-semibold">{listing.rating}</span>
              <span className="text-muted-foreground">({listing.total_reviews})</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <Badge variant="secondary">{listing.bag_type}</Badge>
          </div>
        </div>

        <Separator />

        {/* Pickup Info */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Pickup Information</h2>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Today, {listing.pickup_time}</p>
              <p className="text-sm text-muted-foreground">{listing.items_left} items left</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{listing.address}</p>
              <p className="text-sm text-muted-foreground">{listing.phone}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pickup Instructions */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Pickup Instructions</h2>
          <p className="text-muted-foreground">{listing.pickup_instructions}</p>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">What you might get</h2>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>

        <Separator />

        {/* Ingredients */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Ingredients
          </h2>
          <div className="flex flex-wrap gap-2">
            {listing.ingredients.map((ingredient, idx) => (
              <Badge key={idx} variant="outline">{ingredient}</Badge>
            ))}
          </div>
        </div>

        {/* Allergens */}
        {listing.allergens.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Allergen Information
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.allergens.map((allergen, idx) => (
                  <Badge key={idx} variant="destructive">{allergen}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Rating Breakdown */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Star className="h-5 w-5 fill-rating text-rating" />
            Rating Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(listing.rating_breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="capitalize text-sm">{key}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                  <span className="font-semibold">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Customer Photos */}
        {listing.customer_images.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Photos
            </h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {listing.customer_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Customer photo ${idx + 1}`}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Reviews */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Reviews</h2>
          <div className="space-y-4">
            {listing.reviews.map((review) => (
              <div key={review.id} className="p-4 bg-secondary rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {review.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(review.sentiment)}
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                      <span className="text-sm font-semibold">{review.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* About the Business */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">About {listing.business_name}</h2>
          <p className="text-muted-foreground">{listing.business_description}</p>
        </div>

        {/* Map */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Location</h2>
          <ListingMap latitude={listing.latitude} longitude={listing.longitude} businessName={listing.business_name} />
        </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn("h-5 w-5 mr-2", isFavorite && "fill-primary text-primary")} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleGetDirections}
          >
            <Navigation className="h-5 w-5 mr-2" />
            Directions
          </Button>
          <Button className="flex-1">
            Reserve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
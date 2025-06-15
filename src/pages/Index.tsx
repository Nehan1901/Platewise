
import Header from "@/components/shared/Header";
import ListingCard from "@/components/shared/ListingCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const mockListings = [
  {
    id: "1",
    title: "Surprise Pastry Box",
    original_price: 20.0,
    discounted_price: 6.99,
    image_url: `https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop`,
    business_name: "The Corner Bakery",
  },
  {
    id: "2",
    title: "Artisanal Cheese Platter",
    original_price: 25.0,
    discounted_price: 12.5,
    image_url: `https://images.unsplash.com/photo-1627998994246-a41eda1a76b5?q=80&w=1200&auto=format&fit=crop`,
    business_name: "The Gilded Grape",
  },
  {
    id: "3",
    title: "Gourmet Burger & Fries",
    original_price: 18.5,
    discounted_price: 9.25,
    image_url: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Patty's Pub",
  },
   {
    id: "4",
    title: "Spicy Tuna Roll",
    original_price: 16.0,
    discounted_price: 8.0,
    image_url: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop`,
    business_name: "Sushi Central",
  },
];


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-6">
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Find amazing food, save money.</h1>
            <p className="text-lg text-muted-foreground mb-6">Discover surplus food from your favorite local spots at a great price.</p>
        </div>
        
        <div className="relative mb-10 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for 'pizza', 'sushi', 'organic'..." className="pl-12 h-12 text-base rounded-full" />
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">Available Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;


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
    image_url: `https://images.unsplash.com/photo-1588665809887-5f81fec3b5f8?q=80&w=800&auto=format&fit=crop`,
    business_name: "The Corner Bakery",
  },
  {
    id: "2",
    title: "Fresh Garden Salad",
    original_price: 12.0,
    discounted_price: 4.99,
    image_url: `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop`,
    business_name: "Green Grocers",
  },
  {
    id: "3",
    title: "BBQ Chicken",
    original_price: 18.5,
    discounted_price: 7.5,
    image_url: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop`,
    business_name: "Smokey's BBQ",
  },
   {
    id: "4",
    title: "Margherita Pizza",
    original_price: 22.0,
    discounted_price: 10.0,
    image_url: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop`,
    business_name: "Pizza Heaven",
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

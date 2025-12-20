import { ChevronRight } from "lucide-react";
import ListingCardNew from "./ListingCardNew";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  title: string;
  original_price: number;
  discounted_price: number;
  image_url: string;
  business_name: string;
  business_logo?: string;
  distance?: number;
  pickup_time?: string;
  items_left?: number;
  rating?: number;
  bag_type?: string;
}

interface ListingSectionProps {
  title: string;
  listings: Listing[];
  loading?: boolean;
  badge?: string;
}

const ListingSection = ({ title, listings, loading, badge }: ListingSectionProps) => {
  if (loading) {
    return (
      <section className="py-4">
        <div className="px-4 md:px-6 mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 md:px-6 mb-4">
        <h2 className="text-lg md:text-xl font-bold font-display text-foreground">
          {title}
        </h2>
        <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          See all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-6 pb-2">
        {listings.map((listing, index) => (
          <div 
            key={listing.id} 
            className="flex-shrink-0 w-72 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ListingCardNew listing={listing} badge={badge} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListingSection;

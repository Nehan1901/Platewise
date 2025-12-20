import ListingCard from "@/components/shared/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  title: string;
  original_price: number;
  discounted_price: number;
  image_url: string;
  business_name: string;
  distance?: number;
  pickup_time?: string;
  items_left?: number;
}

interface ListingsGridProps {
  listings: Listing[];
  title: string;
  subtitle?: string;
  loading?: boolean;
}

const ListingsGrid = ({ listings, title, subtitle, loading }: ListingsGridProps) => {
  if (loading) {
    return (
      <section className="py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No listings found nearby. Try expanding your search area.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
};

export default ListingsGrid;

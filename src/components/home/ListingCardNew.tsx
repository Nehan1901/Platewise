import { Heart, Star, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ListingCardNewProps {
  listing: {
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
  };
  badge?: string;
}

const ListingCardNew = ({ listing, badge }: ListingCardNewProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Generate a consistent rating between 3.5-4.9 based on listing id
  const rating = listing.rating || (3.5 + (parseInt(listing.id) * 0.3) % 1.4).toFixed(1);
  const bagType = listing.bag_type || "Surprise Bag";

  return (
    <article className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <Star className="h-3.5 w-3.5 fill-rating text-rating" />
          <span className="text-sm font-semibold text-foreground">{rating}</span>
        </div>
        
        {/* Ending Soon Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
        
        {/* Business Logo */}
        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-card shadow-lg overflow-hidden border-2 border-card flex items-center justify-center">
          {listing.business_logo ? (
            <img src={listing.business_logo} alt={listing.business_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">{listing.business_name.charAt(0)}</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
            {listing.business_name}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="flex-shrink-0 p-1 -m-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )} 
            />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground">{bagType}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {listing.pickup_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Pick up today {listing.pickup_time}
            </span>
          )}
          {listing.distance !== undefined && (
            <>
              <span className="text-border">|</span>
              <span>{listing.distance.toFixed(1)} mi</span>
            </>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-dashed border-border mt-2">
          <span className="text-sm text-muted-foreground line-through">
            ${listing.original_price.toFixed(2)}
          </span>
          <span className="text-lg font-bold text-foreground">
            ${listing.discounted_price.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ListingCardNew;

import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DiscoverListingCardProps {
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
    rating?: number;
    ending_soon?: boolean;
  };
}

const DiscoverListingCard = ({ listing }: DiscoverListingCardProps) => {
  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return `${distance.toFixed(1)} mi`;
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
        {/* Image Section with Overlay */}
        <div className="relative h-40">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Ending Soon Badge */}
          {listing.ending_soon && (
            <Badge 
              className="absolute top-3 left-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1"
            >
              Ending soon
            </Badge>
          )}
          
          {/* Favorite Button */}
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite toggle
            }}
          >
            <Heart className="h-5 w-5 text-white" />
          </button>
          
          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              {listing.business_logo ? (
                <img 
                  src={listing.business_logo} 
                  alt={listing.business_name}
                  className="w-10 h-10 rounded-lg object-cover bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {listing.business_name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-white font-semibold text-sm line-clamp-2">
                {listing.business_name}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {listing.title}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            Pick up {listing.pickup_time}
          </p>
          
          {/* Rating, Distance & Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {listing.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{listing.rating}</span>
                </div>
              )}
              {listing.rating && listing.distance && (
                <span className="text-muted-foreground">|</span>
              )}
              {listing.distance && (
                <span className="text-muted-foreground">
                  {formatDistance(listing.distance)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                ${listing.original_price.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-primary">
                ${listing.discounted_price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiscoverListingCard;

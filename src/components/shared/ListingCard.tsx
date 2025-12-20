import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    original_price: number;
    discounted_price: number;
    image_url: string;
    business_name: string;
    distance?: number;
    pickup_time?: string;
    items_left?: number;
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const discountPercent = Math.round(
    ((listing.original_price - listing.discounted_price) / listing.original_price) * 100
  );

  return (
    <Card className="w-full overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 ease-out shadow-card hover:shadow-card-hover hover:-translate-y-1">
      <CardHeader className="p-0 overflow-hidden relative">
        <img 
          src={listing.image_url} 
          alt={listing.title} 
          className="object-cover h-44 w-full transition-transform duration-500 ease-out group-hover:scale-105" 
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
          -{discountPercent}%
        </Badge>
        {listing.items_left && listing.items_left <= 3 && (
          <Badge variant="destructive" className="absolute top-3 right-3 font-semibold">
            Only {listing.items_left} left!
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate text-foreground">{listing.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{listing.business_name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {listing.distance !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {listing.distance.toFixed(1)} mi
            </span>
          )}
          {listing.pickup_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {listing.pickup_time}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-primary">${listing.discounted_price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground line-through">${listing.original_price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full font-medium" size="sm">
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;

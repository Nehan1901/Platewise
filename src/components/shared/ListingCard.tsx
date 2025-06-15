
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    original_price: number;
    discounted_price: number;
    image_url: string;
    business_name: string;
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Card className="w-full overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <img src={listing.image_url} alt={listing.title} className="rounded-t-lg object-cover h-48 w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1">{listing.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{listing.business_name}</CardDescription>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-primary">${listing.discounted_price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-through">${listing.original_price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">View Deal</Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;

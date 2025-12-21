import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Navigation, Home, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const mockOrders: Record<string, { id: string; title: string; business_name: string; pickup_time: string; address: string; latitude: number; longitude: number; confirmation_code: string }> = {
  "1": { id: "1", title: "Surprise Pastry Box", business_name: "The Corner Bakery", pickup_time: "6:00 PM - 8:00 PM", address: "123 Main Street, New York, NY 10001", latitude: 40.7128, longitude: -74.006, confirmation_code: "PW-1234-ABCD" },
  "2": { id: "2", title: "Artisanal Cheese Platter", business_name: "The Gilded Grape", pickup_time: "7:00 PM - 9:00 PM", address: "456 Wine Avenue, New York, NY 10002", latitude: 40.7148, longitude: -74.008, confirmation_code: "PW-2345-BCDE" },
  "3": { id: "3", title: "Gourmet Burger & Fries", business_name: "Patty's Pub", pickup_time: "8:00 PM - 10:00 PM", address: "789 Burger Lane, New York, NY 10003", latitude: 40.7108, longitude: -74.004, confirmation_code: "PW-3456-CDEF" },
  "4": { id: "4", title: "Spicy Tuna Roll Set", business_name: "Sushi Central", pickup_time: "5:00 PM - 7:00 PM", address: "321 Sushi Street, New York, NY 10004", latitude: 40.7158, longitude: -74.002, confirmation_code: "PW-4567-DEFG" },
  "5": { id: "5", title: "Fresh Veggie Box", business_name: "Green Market Co.", pickup_time: "4:00 PM - 6:00 PM", address: "555 Organic Way, New York, NY 10005", latitude: 40.7118, longitude: -74.01, confirmation_code: "PW-5678-EFGH" },
  "6": { id: "6", title: "Wood-Fired Pizza Slice", business_name: "Napoli Express", pickup_time: "9:00 PM - 10:00 PM", address: "777 Pizza Plaza, New York, NY 10006", latitude: 40.7138, longitude: -74.007, confirmation_code: "PW-6789-FGHI" },
  "7": { id: "7", title: "Chocolate Cake Surprise", business_name: "Sweet Delights", pickup_time: "5:00 PM - 7:00 PM", address: "888 Dessert Drive, New York, NY 10007", latitude: 40.7098, longitude: -74.003, confirmation_code: "PW-7890-GHIJ" },
  "8": { id: "8", title: "Grilled Chicken Meal", business_name: "The Grill House", pickup_time: "6:00 PM - 8:00 PM", address: "999 Grill Street, New York, NY 10008", latitude: 40.7168, longitude: -74.009, confirmation_code: "PW-8901-HIJK" },
};

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = mockOrders[id as keyof typeof mockOrders];

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`,
      "_blank"
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.confirmation_code);
    toast({
      title: "Copied!",
      description: "Confirmation code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Success Animation */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-6 text-center">Order Confirmed!</h1>
        <p className="text-muted-foreground text-center mt-2">
          Your order has been placed successfully
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Confirmation Code */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Show this code at pickup
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold tracking-wider">
                {order.confirmation_code}
              </span>
              <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{order.title}</h3>
              <p className="text-muted-foreground">{order.business_name}</p>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Pickup Time</p>
                <p className="text-sm text-muted-foreground">Today, {order.pickup_time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{order.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" onClick={handleGetDirections}>
            <Navigation className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

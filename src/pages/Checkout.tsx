import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Clock, MapPin, Check, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ApplePayIcon, PaymentCardIcon, PayPalIcon, CashAppIcon } from "@/components/icons/PaymentIcons";

type PaymentMethod = "apple_pay" | "card" | "paypal" | "cash_app";

// Mock listing data for checkout
const mockListings: Record<string, { id: string; title: string; business_name: string; discounted_price: number; original_price: number; pickup_time: string; address: string; image: string }> = {
  "1": { id: "1", title: "Surprise Pastry Box", business_name: "The Corner Bakery", discounted_price: 6.99, original_price: 20.0, pickup_time: "6:00 PM - 8:00 PM", address: "123 Main Street, New York, NY 10001", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=90&w=600&auto=format&fit=crop" },
  "2": { id: "2", title: "Artisanal Cheese Platter", business_name: "The Gilded Grape", discounted_price: 12.5, original_price: 25.0, pickup_time: "7:00 PM - 9:00 PM", address: "456 Wine Avenue, New York, NY 10002", image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=90&w=600&auto=format&fit=crop" },
  "3": { id: "3", title: "Gourmet Burger & Fries", business_name: "Patty's Pub", discounted_price: 9.25, original_price: 18.5, pickup_time: "8:00 PM - 10:00 PM", address: "789 Burger Lane, New York, NY 10003", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=600&auto=format&fit=crop" },
  "4": { id: "4", title: "Spicy Tuna Roll Set", business_name: "Sushi Central", discounted_price: 8.0, original_price: 16.0, pickup_time: "5:00 PM - 7:00 PM", address: "321 Sushi Street, New York, NY 10004", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=90&w=600&auto=format&fit=crop" },
  "5": { id: "5", title: "Fresh Veggie Box", business_name: "Green Market Co.", discounted_price: 8.99, original_price: 22.0, pickup_time: "4:00 PM - 6:00 PM", address: "555 Organic Way, New York, NY 10005", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=90&w=600&auto=format&fit=crop" },
  "6": { id: "6", title: "Wood-Fired Pizza Slice", business_name: "Napoli Express", discounted_price: 4.99, original_price: 12.0, pickup_time: "9:00 PM - 10:00 PM", address: "777 Pizza Plaza, New York, NY 10006", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=90&w=600&auto=format&fit=crop" },
  "7": { id: "7", title: "Chocolate Cake Surprise", business_name: "Sweet Delights", discounted_price: 12.99, original_price: 28.0, pickup_time: "5:00 PM - 7:00 PM", address: "888 Dessert Drive, New York, NY 10007", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=90&w=600&auto=format&fit=crop" },
  "8": { id: "8", title: "Grilled Chicken Meal", business_name: "The Grill House", discounted_price: 7.5, original_price: 15.0, pickup_time: "6:00 PM - 8:00 PM", address: "999 Grill Street, New York, NY 10008", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=90&w=600&auto=format&fit=crop" },
};

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const listing = mockListings[id as keyof typeof mockListings];

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const serviceFee = 0.50;
  const total = listing.discounted_price + serviceFee;
  const savings = listing.original_price - listing.discounted_price;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validatePayment = () => {
    if (selectedPayment === "card") {
      if (!cardNumber || !expiry || !cvv || !name) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return false;
      }
    } else if (selectedPayment === "paypal") {
      if (!paypalEmail) {
        toast({
          title: "Missing Information",
          description: "Please enter your PayPal email.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    toast({
      title: "Order Confirmed! 🎉",
      description: `Your ${listing.title} has been reserved. Show this confirmation at pickup.`,
    });
    
    navigate(`/order-confirmation/${listing.id}`);
  };

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Payment card",
      icon: <PaymentCardIcon />,
    },
    {
      id: "apple_pay" as PaymentMethod,
      name: "Apple Pay",
      icon: <ApplePayIcon />,
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: <PayPalIcon />,
    },
    {
      id: "cash_app" as PaymentMethod,
      name: "Cash App Pay",
      icon: <CashAppIcon />,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">{listing.business_name}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{listing.pickup_time}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Location */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{listing.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Selection */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Payment Method</h2>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${
                  selectedPayment === method.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-muted-foreground/50"
                }`}
                onClick={() => setSelectedPayment(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {method.icon}
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Details - Card */}
        {selectedPayment === "card" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Card Details
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input
                  id="card"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details - PayPal */}
        {selectedPayment === "paypal" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <PayPalIcon />
              PayPal Details
            </h2>

            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="your@email.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Apple Pay - No additional details needed */}
        {selectedPayment === "apple_pay" && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <ApplePayIcon />
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Apple Pay to complete your purchase
            </p>
          </div>
        )}

        {/* Cash App Pay - No additional details needed */}
        {selectedPayment === "cash_app" && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <CashAppIcon />
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Cash App to complete your purchase
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment is secure and encrypted</span>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{listing.title}</span>
              <span>${listing.discounted_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-500">
              <span>You're saving</span>
              <span>${savings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
        <Button 
          className="w-full h-12 text-lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              {selectedPayment === "apple_pay" && <span className="mr-2"><ApplePayIcon /></span>}
              {selectedPayment === "card" && <CreditCard className="h-5 w-5 mr-2" />}
              {selectedPayment === "paypal" && <span className="mr-2"><PayPalIcon /></span>}
              {selectedPayment === "cash_app" && <span className="mr-2"><CashAppIcon /></span>}
              Pay ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;

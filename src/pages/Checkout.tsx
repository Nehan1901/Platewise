import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Shield, Pencil, Minus, Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("apple_pay");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const listing = mockListings[id as keyof typeof mockListings];

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const subtotal = listing.discounted_price * quantity;
  const salesTax = subtotal * 0.075;
  const total = subtotal + salesTax;

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

  const validateCardPayment = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (selectedPayment === "card" && !validateCardPayment()) return;
    
    if (selectedPayment === "paypal") {
      // Redirect to PayPal login
      window.open("https://www.paypal.com/signin", "_blank");
      return;
    }

    if (selectedPayment === "cash_app") {
      // Open Cash App
      window.open("https://cash.app", "_blank");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    toast({
      title: "Order Confirmed!",
      description: `Your ${listing.title} has been reserved.`,
    });
    
    navigate(`/order-confirmation/${listing.id}`);
  };

  const handleSelectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setShowPaymentModal(false);
  };

  const paymentMethods = [
    { id: "apple_pay" as PaymentMethod, name: "Apple Pay", icon: <ApplePayIcon /> },
    { id: "card" as PaymentMethod, name: "Credit or Debit Card", icon: <PaymentCardIcon /> },
    { id: "paypal" as PaymentMethod, name: "PayPal", icon: <PayPalIcon /> },
    { id: "cash_app" as PaymentMethod, name: "Cash App Pay", icon: <CashAppIcon /> },
  ];

  const selectedMethodInfo = paymentMethods.find((m) => m.id === selectedPayment);

  const renderPaymentButton = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      );
    }

    switch (selectedPayment) {
      case "apple_pay":
        return <ApplePayIcon />;
      case "paypal":
        return (
          <span className="flex items-center gap-2">
            <PayPalIcon /> Continue with PayPal
          </span>
        );
      case "cash_app":
        return (
          <span className="flex items-center gap-2">
            <CashAppIcon /> Open Cash App
          </span>
        );
      case "card":
        return `Pay $${total.toFixed(2)}`;
      default:
        return `Pay $${total.toFixed(2)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/listing/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Business Info */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-muted">
            <img
              src={listing.image}
              alt={listing.business_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{listing.business_name} ({listing.title})</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                Pick up today
              </span>
              <span className="text-muted-foreground">{listing.pickup_time}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Method Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Payment Method
          </h2>
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setShowPaymentModal(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedMethodInfo?.icon}
                  <span className="font-medium">{selectedMethodInfo?.name}</span>
                </div>
                <Pencil className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Details - Only show when card is selected */}
        {selectedPayment === "card" && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Card Details
            </h3>

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

        {/* PayPal Info */}
        {selectedPayment === "paypal" && (
          <div className="p-6 bg-muted/30 rounded-lg text-center space-y-4">
            <div className="flex justify-center">
              <PayPalIcon />
            </div>
            <p className="text-muted-foreground">
              You'll be redirected to PayPal to login and complete your payment.
            </p>
          </div>
        )}

        {/* Cash App Info */}
        {selectedPayment === "cash_app" && (
          <div className="p-6 bg-muted/30 rounded-lg text-center space-y-4">
            <div className="flex justify-center">
              <CashAppIcon />
            </div>
            <p className="text-muted-foreground">
              Cash App will open to complete your payment.
            </p>
          </div>
        )}

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sales taxes</span>
              <span>${salesTax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-center text-sm text-muted-foreground">
          By reserving this meal you agree to PlateWise's{" "}
          <a href="#" className="text-primary underline">Terms and Conditions</a>.
        </p>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-muted rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Pay Button */}
          <Button 
            className={`flex-1 h-12 text-lg rounded-full ${
              selectedPayment === "apple_pay" ? "bg-foreground text-background hover:bg-foreground/90" : ""
            }`}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {renderPaymentButton()}
          </Button>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${
                  selectedPayment === method.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleSelectPayment(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <span className="font-medium">{method.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;

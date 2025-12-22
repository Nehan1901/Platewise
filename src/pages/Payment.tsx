import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  label: string;
  number: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: "1", type: "card", label: "Credit Card", number: "*0154694538", icon: "💳" },
  { id: "2", type: "paypal", label: "PayPal", number: "+3324242345", icon: "🅿️" },
];

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock order data
  const orderTotal = 421.0;
  const pickupAddress = {
    street: "Dhaka, Bangladesh",
    details: "Uttara-158",
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed.",
    });
    
    navigate("/order-success");
  };

  return (
    <div className="min-h-screen bg-[hsl(30,30%,96%)] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(30,30%,96%)] border-b border-border/50">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Payment</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Payment Amount */}
        <Card className="p-6 bg-card border-0 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Amount</p>
              <p className="text-3xl font-bold">$ {orderTotal.toFixed(2)}</p>
            </div>
            <div className="w-14 h-14 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-accent-foreground" />
            </div>
          </div>
        </Card>

        {/* Pickup Address */}
        <Card className="p-4 bg-card border-0 shadow-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-0.5">Pickup address</p>
              <p className="font-semibold">{pickupAddress.street}</p>
              <p className="text-sm text-muted-foreground">{pickupAddress.details}</p>
            </div>
            <Button variant="link" className="text-[hsl(var(--accent))] p-0 h-auto font-medium">
              Change
            </Button>
          </div>
        </Card>

        {/* Payment Method */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Payment method</h2>
          
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`p-4 border-2 cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5"
                  : "border-transparent bg-card shadow-card"
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPayment === method.id
                      ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <Check className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(30,85%,45%)] rounded-xl flex items-center justify-center text-xl">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{method.label}</p>
                  <p className="text-sm text-muted-foreground">{method.number}</p>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Card Button */}
          <Button
            variant="outline"
            className="w-full h-14 border-dashed border-2 border-muted-foreground/30 hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[hsl(30,30%,96%)]">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-full font-semibold"
            onClick={() => navigate("/cart")}
          >
            Edit Order
          </Button>
          <Button
            className="flex-1 h-14 rounded-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-accent-foreground font-semibold"
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Pay now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

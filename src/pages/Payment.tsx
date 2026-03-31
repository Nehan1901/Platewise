import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Check, Plus, Wallet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { PayPalIcon } from "@/components/icons/PaymentIcons";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple_pay" | "cash_app";
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    type: "card",
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, Amex",
    icon: <CreditCard className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "apple_pay",
    type: "apple_pay",
    label: "Apple Pay",
    subtitle: "Pay with Apple Pay",
    icon: <AppleIcon className="h-6 w-6" />,
    color: "from-gray-800 to-gray-900",
  },
  {
    id: "paypal",
    type: "paypal",
    label: "PayPal",
    subtitle: "Pay with your PayPal account",
    icon: <Wallet className="h-6 w-6" />,
    color: "from-blue-600 to-blue-700",
  },
  {
    id: "cash_app",
    type: "cash_app",
    label: "Cash App",
    subtitle: "Pay with Cash App",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-green-500 to-green-600",
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = items.length > 0 ? 20 : 0;
  const discountPercent = 10;
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal + deliveryFee - discount;

  const pickupAddress = {
    street: "New York, USA",
    details: "Manhattan, 10001",
  };

  const handlePayNow = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to place an order.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      // Create orders for each cart item
      for (const item of items) {
        const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await supabase.from("orders").insert({
          user_id: user.id,
          listing_id: item.listing_id,
          listing_title: item.title,
          business_name: item.business_name,
          original_price: item.original_price,
          discounted_price: item.price,
          quantity: item.quantity,
          pickup_time: item.pickup_time || null,
          image_url: item.image,
          pickup_code: pickupCode,
          status: "confirmed",
        });
      }

      // Award points
      const pointsEarned = Math.floor(total * 10);
      if (pointsEarned > 0) {
        await supabase.from("points_transactions").insert({
          user_id: user.id,
          points: pointsEarned,
          transaction_type: "earned",
          description: `Earned from order of ${items.length} item(s)`,
        });

        // Update user rewards
        const { data: existing } = await supabase
          .from("user_rewards")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_rewards")
            .update({
              total_points: existing.total_points + pointsEarned,
              lifetime_points: existing.lifetime_points + pointsEarned,
            })
            .eq("user_id", user.id);
        } else {
          await supabase.from("user_rewards").insert({
            user_id: user.id,
            total_points: pointsEarned,
            lifetime_points: pointsEarned,
          });
        }
      }

      clearCart();
      toast({ title: "Payment Successful!", description: `You earned ${pointsEarned} points!` });
      navigate("/order-success");
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Payment</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Payment Amount */}
        <Card className="p-6 bg-primary text-primary-foreground border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">Payment Amount</p>
              <p className="text-3xl font-bold">${total.toFixed(2)}</p>
              <p className="text-xs opacity-70 mt-1">{items.length} item(s) in cart</p>
            </div>
            <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
              <CreditCard className="h-7 w-7" />
            </div>
          </div>
        </Card>

        {/* Order Summary Mini */}
        <Card className="p-4 border shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount (10%)</span>
              <span className="text-primary">-${discount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Pickup Address */}
        <Card className="p-4 border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-0.5">Pickup address</p>
              <p className="font-semibold">{pickupAddress.street}</p>
              <p className="text-sm text-muted-foreground">{pickupAddress.details}</p>
            </div>
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              Change
            </Button>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Payment Method</h2>
          
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`p-4 border-2 cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{method.label}</p>
                  <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Card */}
          <Button
            variant="outline"
            className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Card
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-full font-semibold"
            onClick={() => navigate("/cart")}
          >
            Edit Order
          </Button>
          <Button
            className="flex-1 h-14 rounded-full font-semibold"
            onClick={handlePayNow}
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

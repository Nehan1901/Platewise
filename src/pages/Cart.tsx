import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Star, MapPin, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  title: string;
  business_name: string;
  price: number;
  rating: number;
  distance: string;
  quantity: number;
  image: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    title: "Cheese Burger",
    business_name: "Patty's Pub",
    price: 80.0,
    rating: 5,
    distance: "2 km",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=90&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Barito Rice",
    business_name: "Asian Kitchen",
    price: 50.0,
    rating: 5,
    distance: "1 km",
    quantity: 3,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=90&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Lemak Rice",
    business_name: "Malay Delights",
    price: 40.0,
    rating: 5,
    distance: "3 km",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=90&w=400&auto=format&fit=crop",
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 20;
  const discountPercent = 10;
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="min-h-screen bg-[hsl(30,30%,96%)] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(30,30%,96%)] border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">My Cart({cartItems.length})</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        {cartItems.map((item) => (
          <Card key={item.id} className="p-4 bg-card border-0 shadow-card">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{item.distance}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-semibold text-[hsl(var(--accent))]">
                    $ {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-border"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Price Summary */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium">$ {deliveryFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-[hsl(var(--accent))]">{discountPercent}%</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-lg">$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[hsl(30,30%,96%)]">
        <Button
          className="w-full h-14 text-lg rounded-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-accent-foreground font-semibold"
          onClick={() => navigate("/payment")}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;

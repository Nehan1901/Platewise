import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package,
  Copy,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/shared/BottomNav";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface Order {
  id: string;
  listing_id: string;
  listing_title: string;
  business_name: string;
  image_url: string | null;
  original_price: number;
  discounted_price: number;
  quantity: number;
  pickup_time: string | null;
  pickup_code: string;
  status: string;
  created_at: string;
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, navigate]);

  const copyPickupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Copied!",
      description: "Pickup code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "picked_up":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Picked Up
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Package className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <PageHeader title="Order History" />

      <main className="p-4 space-y-4">
        {loading ? (
          // Loading skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 space-y-3 border">
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start saving food and your orders will appear here
            </p>
            <Button onClick={() => navigate("/")}>
              Browse Listings
            </Button>
          </div>
        ) : (
          // Order list
          orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-card rounded-xl p-4 border space-y-4"
            >
              {/* Order header */}
              <div className="flex items-start gap-4">
                <img
                  src={order.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200"}
                  alt={order.listing_title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{order.listing_title}</h3>
                      <p className="text-sm text-muted-foreground">{order.business_name}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Pickup info */}
              {order.status === "confirmed" && (
                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pickup Code</span>
                    <button
                      onClick={() => copyPickupCode(order.pickup_code)}
                      className="flex items-center gap-2 font-mono font-bold text-lg tracking-wider"
                    >
                      {order.pickup_code}
                      {copiedCode === order.pickup_code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {order.pickup_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Pick up today {order.pickup_time}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  Qty: {order.quantity}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    ${Number(order.original_price).toFixed(2)}
                  </span>
                  {Number(order.discounted_price) === 0 ? (
                    <span className="font-bold text-green-500">FREE</span>
                  ) : (
                    <span className="font-bold">${Number(order.discounted_price).toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default OrderHistory;
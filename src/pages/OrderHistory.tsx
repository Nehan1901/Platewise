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
  Check,
  HelpCircle,
  CreditCard,
  RotateCcw,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/shared/BottomNav";
import PageHeader from "@/components/shared/PageHeader";

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
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
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
  }, [user, authLoading]);

  const copyPickupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Copied!", description: "Pickup code copied to clipboard" });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "picked_up":
        return (
          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Picked Up
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">
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
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="My Orders" />

      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {loading ? (
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-2 max-w-sm">
              You haven't placed any orders yet. Start exploring nearby listings to rescue surplus food at great prices!
            </p>
            <Button onClick={() => navigate("/")} className="mt-4 rounded-full px-6">
              Browse Listings
            </Button>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const savings = Number(order.original_price) - Number(order.discounted_price);

            return (
              <div
                key={order.id}
                className="bg-card rounded-xl border overflow-hidden transition-all"
              >
                {/* Main order row */}
                <button
                  className="w-full p-4 text-left"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={order.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200"}
                      alt={order.listing_title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">{order.listing_title}</h3>
                          <p className="text-sm text-muted-foreground">{order.business_name}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    <Separator />

                    {/* Pickup code for confirmed orders */}
                    {order.status === "confirmed" && (
                      <div className="bg-primary/10 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Pickup Code</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPickupCode(order.pickup_code);
                            }}
                            className="flex items-center gap-2 font-mono font-bold text-lg tracking-wider text-primary"
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>Pick up today {order.pickup_time}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment summary */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Details
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Original price</span>
                          <span className="text-foreground">${Number(order.original_price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Discount</span>
                          <span>-${savings.toFixed(2)}</span>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">Total paid</span>
                          {Number(order.discounted_price) === 0 ? (
                            <span className="text-green-600 dark:text-green-400">FREE</span>
                          ) : (
                            <span className="text-foreground">${Number(order.discounted_price).toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Quantity</span>
                          <span>{order.quantity}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Order placed</span>
                          <span>{formatDate(order.created_at)} at {formatTime(order.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/help-with-order");
                        }}
                      >
                        <HelpCircle className="h-4 w-4 mr-1.5" />
                        Get Help
                      </Button>
                      {order.status === "picked_up" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listing/${order.listing_id}`);
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-1.5" />
                          Reorder
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Contact support",
                              description: "To cancel an order, please contact our support team.",
                            });
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default OrderHistory;

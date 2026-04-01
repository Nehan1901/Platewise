import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, CheckCircle2, XCircle, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import BottomNav from "@/components/shared/BottomNav";

interface Order {
  id: string;
  listing_title: string;
  quantity: number;
  original_price: number;
  discounted_price: number;
  pickup_code: string;
  pickup_time: string | null;
  status: string;
  created_at: string;
}

const RestaurantOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("restaurant-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setOrders((prev) => [payload.new as Order, ...prev]);
          toast({ title: "🔔 New Order!", description: (payload.new as Order).listing_title });
        } else if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o)));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Get business profile first
      const { data: profile } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (profile) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("business_id", profile.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast({ title: "Updated", description: `Order marked as ${status.replace("_", " ")}` });
    }
  };

  const pending = orders.filter((o) => o.status === "pending" || o.status === "confirmed");
  const pickedUp = orders.filter((o) => o.status === "picked_up");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  const renderOrder = (order: Order) => (
    <Card key={order.id} className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{order.listing_title}</h3>
            <p className="text-sm text-muted-foreground">
              {order.quantity} item{order.quantity > 1 ? "s" : ""} · ${Number(order.discounted_price).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded w-fit">Pickup: {order.pickup_code}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={order.status === "confirmed" ? "default" : order.status === "picked_up" ? "secondary" : order.status === "cancelled" ? "destructive" : "outline"}>
              {order.status === "confirmed" && <Clock className="h-3 w-3 mr-1" />}
              {order.status === "picked_up" && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {order.status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
              {order.status.replace("_", " ")}
            </Badge>
            <div className="flex gap-1">
              {order.status === "pending" && (
                <Button size="sm" onClick={() => updateStatus(order.id, "confirmed")}>Confirm</Button>
              )}
              {order.status === "confirmed" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, "picked_up")}>
                  Mark Picked Up
                </Button>
              )}
              {(order.status === "pending" || order.status === "confirmed") && (
                <Button size="sm" variant="destructive" onClick={() => updateStatus(order.id, "cancelled")}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Order Management" />

        <Tabs defaultValue="active" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="active">Active ({pending.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({pickedUp.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
          </TabsList>

          {[
            { key: "active", data: pending },
            { key: "completed", data: pickedUp },
            { key: "cancelled", data: cancelled },
          ].map(({ key, data }) => (
            <TabsContent key={key} value={key}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Card key={i} className="mb-3"><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>)
              ) : data.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No {key} orders</p>
                </div>
              ) : (
                data.map(renderOrder)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantOrders;

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, CheckCircle2, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setLoading(true);
    fetchOrders();
  }, [user, authLoading]);

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

  const filtered = orders.filter((o) =>
    o.listing_title.toLowerCase().includes(search.toLowerCase()) ||
    o.pickup_code.toLowerCase().includes(search.toLowerCase())
  );

  const pending = filtered.filter((o) => o.status === "pending" || o.status === "confirmed");
  const pickedUp = filtered.filter((o) => o.status === "picked_up");
  const cancelled = filtered.filter((o) => o.status === "cancelled");

  const renderOrder = (order: Order) => (
    <Card key={order.id} className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{order.listing_title}</h3>
            <p className="text-xs text-muted-foreground font-sans">
              {order.quantity} item{order.quantity > 1 ? "s" : ""} · ${Number(order.discounted_price).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground font-sans">{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
            <span className="inline-block text-xs font-mono bg-muted px-2 py-0.5 rounded">Pickup: {order.pickup_code}</span>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge
              variant={order.status === "confirmed" ? "default" : order.status === "picked_up" ? "secondary" : order.status === "cancelled" ? "destructive" : "outline"}
              className="text-xs"
            >
              {order.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
              {order.status === "confirmed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {order.status === "picked_up" && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {order.status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
              {order.status.replace("_", " ")}
            </Badge>
            <div className="flex gap-1">
              {order.status === "pending" && (
                <Button size="sm" className="h-7 text-xs rounded-full" onClick={() => updateStatus(order.id, "confirmed")}>Confirm</Button>
              )}
              {order.status === "confirmed" && (
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => updateStatus(order.id, "picked_up")}>
                  Picked Up
                </Button>
              )}
              {(order.status === "pending" || order.status === "confirmed") && (
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => updateStatus(order.id, "cancelled")}>
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
        <PageHeader title="Order Management" backTo="/dashboard-business" />

        <div className="relative mt-4 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or pickup code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full font-sans"
          />
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full rounded-full">
            <TabsTrigger value="active" className="rounded-full font-sans text-xs">Active ({pending.length})</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-full font-sans text-xs">Completed ({pickedUp.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-full font-sans text-xs">Cancelled ({cancelled.length})</TabsTrigger>
          </TabsList>

          {[
            { key: "active", data: pending },
            { key: "completed", data: pickedUp },
            { key: "cancelled", data: cancelled },
          ].map(({ key, data }) => (
            <TabsContent key={key} value={key} className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
              ) : data.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-sans">No {key} orders</p>
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

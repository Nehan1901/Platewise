import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, PlusCircle, User, Package, DollarSign, Leaf, CheckCircle2, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
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

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  useEffect(() => {
    if (user) fetchData();
    else setLoading(false);
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Get business profile
      const { data: profile } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setBusinessProfile(profile);

      if (profile) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("business_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Realtime orders
  useEffect(() => {
    if (!businessProfile) return;
    const channel = supabase
      .channel("dashboard-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT" && (payload.new as any).business_id === businessProfile.id) {
          setOrders((prev) => [payload.new as Order, ...prev]);
          toast({ title: "🔔 New Order!", description: (payload.new as Order).listing_title });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [businessProfile]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast({ title: "Order Updated", description: `Order marked as ${newStatus.replace("_", " ")}` });
    }
  };

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.discounted_price) * o.quantity, 0);
  const totalItemsSaved = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.quantity, 0);
  const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "pending");
  const pickedUpOrders = orders.filter((o) => o.status === "picked_up");

  if (!loading && !businessProfile) {
    return (
      <>
        <Header />
        <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Set Up Your Restaurant</h1>
          <p className="text-muted-foreground mb-6">Create your business profile to start listing surplus food.</p>
          <Button asChild size="lg">
            <Link to="/business-profile">Set Up Profile</Link>
          </Button>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-1">
          {businessProfile?.business_name || "Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">Manage your restaurant</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: User, label: "Profile", path: "/business-profile" },
            { icon: PlusCircle, label: "Add Listing", path: "/create-listing" },
            { icon: List, label: "My Listings", path: "/my-listings" },
            { icon: BarChart3, label: "Analytics", path: "/restaurant-analytics" },
          ].map(({ icon: Icon, label, path }) => (
            <Card key={path} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4 text-center">
                <Icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
                <Button asChild variant="link" className="p-0 h-auto text-sm">
                  <Link to={path}>{label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Package, label: "Total Orders", value: orders.length },
            { icon: DollarSign, label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
            { icon: Leaf, label: "Items Saved", value: totalItemsSaved },
            { icon: TrendingUp, label: "Pickup Rate", value: `${orders.length > 0 ? Math.round((pickedUpOrders.length / orders.length) * 100) : 0}%` },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <p className="text-xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="active">Active ({confirmedOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({pickedUpOrders.length})</TabsTrigger>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          </TabsList>

          {["active", "completed", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
                ))
              ) : (() => {
                const filtered = tab === "active" ? confirmedOrders : tab === "completed" ? pickedUpOrders : orders;
                return filtered.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No {tab} orders</p>
                  </div>
                ) : (
                  filtered.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{order.listing_title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.quantity} item{order.quantity > 1 ? "s" : ""} · ${Number(order.discounted_price).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</p>
                            <p className="text-xs font-mono mt-1">Code: {order.pickup_code}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={order.status === "confirmed" || order.status === "pending" ? "default" : order.status === "picked_up" ? "secondary" : "destructive"}>
                              {(order.status === "confirmed" || order.status === "pending") && <Clock className="h-3 w-3 mr-1" />}
                              {order.status === "picked_up" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {order.status.replace("_", " ")}
                            </Badge>
                            {(order.status === "confirmed" || order.status === "pending") && (
                              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "picked_up")}>
                                Mark Picked Up
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                );
              })()}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <BottomNav />
    </>
  );
};

export default BusinessDashboard;

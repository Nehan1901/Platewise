import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle, Package, DollarSign, Leaf, CheckCircle2, Clock,
  TrendingUp, BarChart3, Bell, HelpCircle, Store, Wallet,
  List, User, ChevronRight, XCircle
} from "lucide-react";
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
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [listingCount, setListingCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setBusinessProfile(profile);

      if (profile) {
        const [ordersRes, listingsRes] = await Promise.all([
          supabase
            .from("orders")
            .select("*")
            .eq("business_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(20),
          supabase
            .from("listings")
            .select("id", { count: "exact" })
            .eq("business_id", profile.id),
        ]);
        setOrders(ordersRes.data || []);
        setListingCount(listingsRes.count || 0);
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
        } else if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o)));
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
  const activeOrders = orders.filter((o) => o.status === "confirmed" || o.status === "pending");
  const pickedUpOrders = orders.filter((o) => o.status === "picked_up");

  if (!loading && !authLoading && !businessProfile) {
    return (
      <>
        <Header />
        <main className="px-4 md:px-6 py-12 max-w-2xl mx-auto text-center pb-24 md:pb-6">
          <div className="bg-accent/50 rounded-2xl p-8">
            <Store className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-2">Set Up Your Restaurant</h1>
            <p className="text-muted-foreground mb-6 font-sans">Create your business profile to start listing surplus food and reduce waste.</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/business-profile">Get Started</Link>
            </Button>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const quickActions = [
    { icon: PlusCircle, label: "Add Listing", path: "/create-listing", color: "text-primary" },
    { icon: List, label: "My Listings", path: "/my-listings", color: "text-primary" },
    { icon: Package, label: "Orders", path: "/restaurant-orders", color: "text-primary" },
    { icon: BarChart3, label: "Analytics", path: "/restaurant-analytics", color: "text-primary" },
    { icon: User, label: "Profile", path: "/business-profile", color: "text-primary" },
    { icon: Bell, label: "Alerts", path: "/restaurant-notifications", color: "text-primary" },
    { icon: Wallet, label: "Earnings", path: "/restaurant-wallet", color: "text-primary" },
    { icon: HelpCircle, label: "Help", path: "/restaurant-help", color: "text-primary" },
  ];

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{businessProfile?.business_name || "Dashboard"}</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            {activeOrders.length > 0
              ? `${activeOrders.length} active order${activeOrders.length > 1 ? "s" : ""} awaiting action`
              : "All caught up — no pending orders"}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: Package, label: "Total Orders", value: orders.length },
                { icon: DollarSign, label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
                { icon: Leaf, label: "Items Saved", value: totalItemsSaved },
                { icon: TrendingUp, label: "Pickup Rate", value: `${orders.length > 0 ? Math.round((pickedUpOrders.length / orders.length) * 100) : 0}%` },
              ].map(({ icon: Icon, label, value }) => (
                <Card key={label} className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground font-sans">{label}</span>
                    </div>
                    <p className="text-xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map(({ icon: Icon, label, path }) => (
                  <Link key={path} to={path}>
                    <Card className="shadow-card hover:shadow-card-hover transition-all hover:scale-[1.02] cursor-pointer">
                      <CardContent className="pt-3 pb-3 px-2 text-center">
                        <Icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
                        <span className="text-xs font-sans font-medium text-foreground">{label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Orders Feed */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Active Orders</h2>
                <Button asChild variant="link" size="sm" className="text-primary font-sans">
                  <Link to="/restaurant-orders">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>

              {activeOrders.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-8 text-center">
                    <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-primary/40" />
                    <p className="text-muted-foreground font-sans">No active orders right now</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeOrders.slice(0, 5).map((order) => (
                    <Card key={order.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-sm">{order.listing_title}</h3>
                            <p className="text-xs text-muted-foreground font-sans">
                              {order.quantity} item{order.quantity > 1 ? "s" : ""} · ${Number(order.discounted_price).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground font-sans">
                              {format(new Date(order.created_at), "MMM d, h:mm a")}
                            </p>
                            <span className="inline-block text-xs font-mono bg-muted px-2 py-0.5 rounded mt-1">
                              {order.pickup_code}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={order.status === "pending" ? "outline" : "default"} className="text-xs">
                              {order.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {order.status === "confirmed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {order.status.replace("_", " ")}
                            </Badge>
                            <div className="flex gap-1">
                              {order.status === "pending" && (
                                <Button size="sm" className="h-7 text-xs rounded-full" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                                  Confirm
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => updateOrderStatus(order.id, "picked_up")}>
                                  Picked Up
                                </Button>
                              )}
                              {(order.status === "pending" || order.status === "confirmed") && (
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats Summary */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground font-sans">Active Listings</span>
                  <span className="font-semibold">{listingCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground font-sans">Completed Orders</span>
                  <span className="font-semibold">{pickedUpOrders.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground font-sans">CO₂ Saved</span>
                  <span className="font-semibold text-primary">{Math.round(totalItemsSaved * 2.5)}kg</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default BusinessDashboard;

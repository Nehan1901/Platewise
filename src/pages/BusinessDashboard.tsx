import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, PlusCircle, User, Package, DollarSign, Leaf, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  listing_title: string;
  business_name: string;
  quantity: number;
  original_price: number;
  discounted_price: number;
  pickup_code: string;
  pickup_time: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      // In a real app, filter by business_id. For demo, show all orders
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast({ title: "Order Updated", description: `Order marked as ${newStatus.replace("_", " ")}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    }
  };

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.discounted_price * o.quantity, 0);
  const totalItemsSaved = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.quantity, 0);
  const confirmedOrders = orders.filter(o => o.status === "confirmed");
  const pickedUpOrders = orders.filter(o => o.status === "picked_up");

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage your listings and orders</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <User className="h-6 w-6 mx-auto mb-2 text-primary" />
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to="/business-profile">Manage Profile</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <PlusCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to="/create-listing">Add Listing</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <List className="h-6 w-6 mx-auto mb-2 text-primary" />
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to="/my-listings">My Listings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Orders</span>
              </div>
              <p className="text-2xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Items Saved</span>
              </div>
              <p className="text-2xl font-bold">{totalItemsSaved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Pickup Rate</span>
              </div>
              <p className="text-2xl font-bold">
                {orders.length > 0 ? Math.round((pickedUpOrders.length / orders.length) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="active">
              Active ({confirmedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({pickedUpOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          </TabsList>

          {["active", "completed", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
                ))
              ) : (
                (() => {
                  const filtered =
                    tab === "active" ? confirmedOrders :
                    tab === "completed" ? pickedUpOrders : orders;
                  
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
                                {order.quantity} item{order.quantity > 1 ? "s" : ""} • ${order.discounted_price.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
                              </p>
                              <p className="text-xs font-mono mt-1">Code: {order.pickup_code}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={order.status === "confirmed" ? "default" : order.status === "picked_up" ? "secondary" : "destructive"}>
                                {order.status === "confirmed" && <Clock className="h-3 w-3 mr-1" />}
                                {order.status === "picked_up" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {order.status.replace("_", " ")}
                              </Badge>
                              {order.status === "confirmed" && (
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
                })()
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default BusinessDashboard;

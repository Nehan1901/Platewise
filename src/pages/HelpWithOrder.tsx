import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Package, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";
import { format } from "date-fns";

interface Order {
  id: string;
  listing_title: string;
  business_name: string;
  status: string;
  created_at: string;
}

const HelpWithOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, listing_title, business_name, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const commonIssues = [
    { id: "pickup", label: "I couldn't pick up my order" },
    { id: "quality", label: "Food quality issue" },
    { id: "missing", label: "Missing items" },
    { id: "wrong", label: "Wrong order received" },
    { id: "refund", label: "Request a refund" },
    { id: "other", label: "Other issue" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Help with an order" />

      <div className="p-4 space-y-6">
        {/* Select order section */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Select an order
          </h3>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No recent orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.listing_title}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.business_name} • {format(new Date(order.created_at), "MMM d")}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Common issues */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Common issues
          </h3>

          <div className="space-y-2">
            {commonIssues.map((issue) => (
              <Card key={issue.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <span>{issue.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact support */}
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-2">Need more help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help you 24/7
            </p>
            <Button className="w-full">Contact Support</Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default HelpWithOrder;

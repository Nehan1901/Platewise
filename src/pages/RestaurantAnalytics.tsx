import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Package, Leaf, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import BottomNav from "@/components/shared/BottomNav";

const RestaurantAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, itemsSaved: 0, co2Saved: 0, uniqueCustomers: 0 });
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; orders: number }[]>([]);

  useEffect(() => {
    if (user) fetchAnalytics();
    else setLoading(false);
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const { data: profile } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!profile) { setLoading(false); return; }

      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("business_id", profile.id)
        .neq("status", "cancelled");

      if (orders) {
        const revenue = orders.reduce((s, o) => s + Number(o.discounted_price) * o.quantity, 0);
        const itemsSaved = orders.reduce((s, o) => s + o.quantity, 0);
        const uniqueCustomers = new Set(orders.map((o) => o.user_id)).size;

        setStats({
          revenue,
          orders: orders.length,
          itemsSaved,
          co2Saved: Math.round(itemsSaved * 2.5), // ~2.5kg CO2 per food item saved
          uniqueCustomers,
        });

        // Build daily chart data for last 14 days
        const days: { date: string; revenue: number; orders: number }[] = [];
        for (let i = 13; i >= 0; i--) {
          const day = startOfDay(subDays(new Date(), i));
          const dayStr = format(day, "yyyy-MM-dd");
          const dayOrders = orders.filter((o) => format(new Date(o.created_at), "yyyy-MM-dd") === dayStr);
          days.push({
            date: format(day, "MMM d"),
            revenue: dayOrders.reduce((s, o) => s + Number(o.discounted_price) * o.quantity, 0),
            orders: dayOrders.length,
          });
        }
        setDailyData(days);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Analytics" />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {[
                { icon: DollarSign, label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
                { icon: Package, label: "Orders", value: stats.orders },
                { icon: Leaf, label: "Items Saved", value: stats.itemsSaved },
                { icon: TrendingUp, label: "CO₂ Saved", value: `${stats.co2Saved}kg` },
                { icon: Users, label: "Customers", value: stats.uniqueCustomers },
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

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Revenue (Last 14 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Orders (Last 14 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantAnalytics;

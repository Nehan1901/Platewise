import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Package, Leaf, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import BottomNav from "@/components/shared/BottomNav";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const RestaurantAnalytics = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, itemsSaved: 0, co2Saved: 0, uniqueCustomers: 0 });
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setLoading(true);
    fetchAnalytics();
  }, [user, authLoading]);

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
        .eq("business_id", profile.id);

      if (orders) {
        const nonCancelled = orders.filter((o) => o.status !== "cancelled");
        const revenue = nonCancelled.reduce((s, o) => s + Number(o.discounted_price) * o.quantity, 0);
        const itemsSaved = nonCancelled.reduce((s, o) => s + o.quantity, 0);
        const uniqueCustomers = new Set(nonCancelled.map((o) => o.user_id)).size;

        setStats({ revenue, orders: nonCancelled.length, itemsSaved, co2Saved: Math.round(itemsSaved * 2.5), uniqueCustomers });

        // Status breakdown
        const statusCounts: Record<string, number> = {};
        orders.forEach((o) => {
          const label = o.status.replace("_", " ");
          statusCounts[label] = (statusCounts[label] || 0) + 1;
        });
        setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

        // Daily chart data
        const days: { date: string; revenue: number; orders: number }[] = [];
        for (let i = 13; i >= 0; i--) {
          const day = startOfDay(subDays(new Date(), i));
          const dayStr = format(day, "yyyy-MM-dd");
          const dayOrders = nonCancelled.filter((o) => format(new Date(o.created_at), "yyyy-MM-dd") === dayStr);
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
        <PageHeader title="Analytics" backTo="/dashboard-business" />

        {loading ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {[
                { icon: DollarSign, label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
                { icon: Package, label: "Orders", value: stats.orders },
                { icon: Leaf, label: "Items Saved", value: stats.itemsSaved },
                { icon: TrendingUp, label: "CO₂ Saved", value: `${stats.co2Saved}kg` },
                { icon: Users, label: "Customers", value: stats.uniqueCustomers },
              ].map(({ icon: Icon, label, value }) => (
                <Card key={label} className="shadow-card">
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

            <Card className="mt-6 shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Revenue — Last 14 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Orders — Last 14 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Order Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground font-sans py-8">No orders yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantAnalytics;

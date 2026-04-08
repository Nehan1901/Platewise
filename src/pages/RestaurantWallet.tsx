import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import BottomNav from "@/components/shared/BottomNav";

interface EarningEntry {
  id: string;
  listing_title: string;
  amount: number;
  quantity: number;
  date: string;
  status: string;
}

const RestaurantWallet = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState<EarningEntry[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisWeek, setThisWeek] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setLoading(true);
    fetchEarnings();
  }, [user, authLoading]);

  const fetchEarnings = async () => {
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
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (orders) {
        const entries: EarningEntry[] = orders.map((o) => ({
          id: o.id,
          listing_title: o.listing_title,
          amount: Number(o.discounted_price) * o.quantity,
          quantity: o.quantity,
          date: o.created_at,
          status: o.status,
        }));
        setEarnings(entries);

        const total = entries.reduce((s, e) => s + e.amount, 0);
        setTotalEarnings(total);

        const weekAgo = startOfDay(subDays(new Date(), 7));
        const weekEarnings = entries.filter((e) => new Date(e.date) >= weekAgo).reduce((s, e) => s + e.amount, 0);
        setThisWeek(weekEarnings);

        const pending = entries.filter((e) => e.status === "confirmed" || e.status === "pending").reduce((s, e) => s + e.amount, 0);
        setPendingPayout(pending);
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
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Earnings" />

        {loading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-32 rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Total Balance */}
            <Card className="shadow-card mt-4 bg-gradient-to-br from-primary/10 to-accent/50">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-3">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-sans mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">${totalEarnings.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Card className="shadow-card">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-sans">This Week</span>
                  </div>
                  <p className="text-xl font-bold">${thisWeek.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-accent">
                      <Calendar className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground font-sans">Pending</span>
                  </div>
                  <p className="text-xl font-bold">${pendingPayout.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <Card className="shadow-card mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {earnings.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-sans text-sm">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {earnings.slice(0, 15).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-lg ${entry.status === "picked_up" ? "bg-primary/10" : "bg-accent"}`}>
                            {entry.status === "picked_up" ? (
                              <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{entry.listing_title}</p>
                            <p className="text-xs text-muted-foreground font-sans">{format(new Date(entry.date), "MMM d, h:mm a")} · {entry.quantity} item{entry.quantity > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">+${entry.amount.toFixed(2)}</p>
                          <Badge variant={entry.status === "picked_up" ? "default" : "secondary"} className="text-[10px] h-4 mt-0.5">
                            {entry.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantWallet;

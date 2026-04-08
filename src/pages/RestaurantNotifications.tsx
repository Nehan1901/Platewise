import { useState } from "react";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/shared/BottomNav";

interface Notification {
  id: string;
  type: "order" | "alert" | "milestone" | "tip";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "order", title: "New Order Received", message: "A customer ordered 2x Lunch Special Pasta. Confirm the order to proceed.", time: "2 min ago", read: false },
  { id: "2", type: "alert", title: "Low Stock Alert", message: "Your 'Organic Bread Box' listing has only 1 item left.", time: "1 hour ago", read: false },
  { id: "3", type: "milestone", title: "🎉 50 Items Saved!", message: "You've helped save 50 food items from going to waste. Keep it up!", time: "3 hours ago", read: true },
  { id: "4", type: "tip", title: "Tip: Peak Hours", message: "Listings posted between 10–11 AM get 40% more orders. Try scheduling your next listing!", time: "Yesterday", read: true },
  { id: "5", type: "order", title: "Order Picked Up", message: "Order #A3F2 was successfully picked up by the customer.", time: "Yesterday", read: true },
];

const iconMap = {
  order: Package,
  alert: AlertTriangle,
  milestone: TrendingUp,
  tip: CheckCircle2,
};

const RestaurantNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader
          title="Notifications"
          rightAction={
            unreadCount > 0 ? (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs font-sans text-primary">
                Mark all read
              </Button>
            ) : undefined
          }
        />

        <div className="space-y-3 mt-4">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground font-sans">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = iconMap[notif.type];
              return (
                <Card
                  key={notif.id}
                  className={`shadow-card transition-shadow ${!notif.read ? "border-l-2 border-l-primary" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg shrink-0 h-fit ${
                        notif.type === "order" ? "bg-primary/10" :
                        notif.type === "alert" ? "bg-destructive/10" :
                        notif.type === "milestone" ? "bg-chart-1/10" :
                        "bg-accent"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          notif.type === "order" ? "text-primary" :
                          notif.type === "alert" ? "text-destructive" :
                          "text-foreground"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold truncate">{notif.title}</h3>
                          {!notif.read && <Badge className="text-[10px] h-4 px-1.5 shrink-0">New</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground font-sans mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantNotifications;

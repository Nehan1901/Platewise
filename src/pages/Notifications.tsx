import { useState } from "react";
import { Bell, Package, Gift, Store, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface NotificationSetting {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
}

const Notifications = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "orders",
      icon: Package,
      title: "Order updates",
      description: "Get notified about your order status changes",
      enabled: true,
    },
    {
      id: "expiring",
      icon: Clock,
      title: "Expiring soon alerts",
      description: "Alerts when items in your pantry are expiring",
      enabled: true,
    },
    {
      id: "nearby",
      icon: Store,
      title: "Nearby deals",
      description: "New listings from stores near you",
      enabled: false,
    },
    {
      id: "rewards",
      icon: Gift,
      title: "Rewards & promotions",
      description: "Special offers and reward points updates",
      enabled: true,
    },
    {
      id: "reminders",
      icon: Bell,
      title: "Pickup reminders",
      description: "Reminders before your pickup time",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Notifications" />

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center px-4">
          You can change these settings at any time. We'll only send you notifications you want to receive.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Notifications;

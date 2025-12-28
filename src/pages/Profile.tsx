import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, ChevronRight, User, CreditCard, Gift, Award, Bell, Users, Store, HelpCircle, Info, Briefcase, EyeOff, Scale, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/shared/BottomNav";
import { format } from "date-fns";
import { Copy, Clock, CheckCircle2, Package, XCircle } from "lucide-react";

interface Order {
  id: string;
  listing_title: string;
  business_name: string;
  image_url: string | null;
  quantity: number;
  original_price: number;
  discounted_price: number;
  pickup_time: string | null;
  pickup_code: string;
  status: string;
  created_at: string;
}

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  action?: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPickupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Copied!",
      description: "Pickup code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "picked_up":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Package className="h-3 w-3 mr-1" />
            Picked Up
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const handleLogout = async () => {
    await signOut();
    setSettingsOpen(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "SETTINGS",
      items: [
        { icon: User, label: "Account details", path: "/account" },
        { icon: CreditCard, label: "Payment cards", path: "/wallet" },
        { icon: Gift, label: "Vouchers", path: "/vouchers" },
        { icon: Award, label: "Special Rewards", path: "/wallet" },
        { icon: Bell, label: "Notifications", path: "/notifications" },
      ],
    },
    {
      title: "COMMUNITY",
      items: [
        { icon: Users, label: "Invite your friends", path: "/invite" },
        { icon: Store, label: "Recommend a store", path: "/recommend" },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { icon: HelpCircle, label: "Help with an order", path: "/help" },
        { icon: Info, label: "How PlateWise works", path: "/how-it-works" },
        { icon: Briefcase, label: "Careers", path: "/careers" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { icon: EyeOff, label: "Hidden stores", path: "/hidden-stores" },
        { icon: Scale, label: "Legal", path: "/legal" },
      ],
    },
  ];

  const handleSettingsItemClick = (item: SettingsItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      setSettingsOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">My Orders</h1>
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-center">Manage account</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {settingsSections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                      {section.title}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            onClick={() => handleSettingsItemClick(item)}
                            className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Order History Content */}
      <div className="p-4 space-y-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Start saving food and money by browsing available listings near you.
            </p>
            <Button onClick={() => navigate("/discover")}>Browse Listings</Button>
          </div>
        ) : (
          // Order list
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl p-4 border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  {order.image_url ? (
                    <img
                      src={order.image_url}
                      alt={order.listing_title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{order.listing_title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.business_name}
                  </p>
                  <div className="mt-2">{getStatusBadge(order.status)}</div>
                </div>
              </div>

              {/* Pickup info for confirmed orders */}
              {order.status === "confirmed" && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup Code</p>
                      <p className="font-mono font-bold text-lg">{order.pickup_code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPickupCode(order.pickup_code)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedCode === order.pickup_code ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  {order.pickup_time && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      Pickup: {formatDate(order.pickup_time)}
                    </p>
                  )}
                </div>
              )}

              {/* Order details */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {order.quantity} item{order.quantity > 1 ? "s" : ""} •{" "}
                  {formatDate(order.created_at)}
                </span>
                <div className="text-right">
                  <span className="line-through text-muted-foreground mr-2">
                    ${order.original_price.toFixed(2)}
                  </span>
                  <span className="font-semibold text-primary">
                    ${order.discounted_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  CreditCard,
  Gift,
  Award,
  Bell,
  Users,
  Store,
  HelpCircle,
  Info,
  Briefcase,
  EyeOff,
  Scale,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/shared/BottomNav";
import PageHeader from "@/components/shared/PageHeader";

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  path?: string;
  action?: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "MY ACTIVITY",
      items: [
        { icon: ShoppingBag, label: "My Orders", subtitle: "View order history & pickup codes", path: "/orders" },
        { icon: CreditCard, label: "Wallet", subtitle: "Payment cards & rewards", path: "/wallet" },
        { icon: Gift, label: "Vouchers", subtitle: "Redeem & manage vouchers", path: "/vouchers" },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        { icon: User, label: "Account Details", subtitle: "Name, email & phone", path: "/account" },
        { icon: Bell, label: "Notifications", subtitle: "Manage notification preferences", path: "/notifications" },
      ],
    },
    {
      title: "COMMUNITY",
      items: [
        { icon: Users, label: "Invite Friends", subtitle: "Share PlateWise & earn rewards", path: "/invite" },
        { icon: Store, label: "Recommend a Store", subtitle: "Suggest a store near you", path: "/recommend" },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { icon: HelpCircle, label: "Help with an Order", subtitle: "Get support for issues", path: "/help" },
        { icon: Info, label: "How PlateWise Works", subtitle: "Learn about our mission", path: "/how-it-works" },
        { icon: Briefcase, label: "Careers", subtitle: "Join our team", path: "/careers" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { icon: EyeOff, label: "Hidden Stores", subtitle: "Stores you've hidden", path: "/hidden-stores" },
        { icon: Scale, label: "Legal", subtitle: "Terms, privacy & licenses", path: "/legal" },
      ],
    },
  ];

  const handleItemClick = (item: SettingsItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  if (!user) return null;

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user.email || "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Profile" />

      {/* User Info Card */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 p-4 bg-card rounded-xl border">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {user.user_metadata?.first_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
                : userEmail.split("@")[0]}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{userEmail}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/account")}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-4 space-y-6 pb-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-card rounded-xl border overflow-hidden divide-y divide-border">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleItemClick(item)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-destructive/10 text-destructive transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <LogOut className="h-4.5 w-4.5" />
            </div>
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

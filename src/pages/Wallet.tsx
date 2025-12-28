import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Gift, 
  Plus, 
  Wallet as WalletIcon, 
  History, 
  Clock, 
  Crown, 
  Sparkles,
  TrendingUp,
  Check,
  AlertTriangle
} from "lucide-react";
import Header from "@/components/shared/Header";
import BottomNav from "@/components/shared/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";

// Tier definitions
const TIERS = [
  { 
    name: "Bronze", 
    minPoints: 0, 
    color: "bg-amber-700", 
    textColor: "text-amber-700",
    benefits: ["1 point per $1 spent", "Basic rewards access", "Birthday bonus"] 
  },
  { 
    name: "Silver", 
    minPoints: 500, 
    color: "bg-slate-400", 
    textColor: "text-slate-400",
    benefits: ["1.25x points multiplier", "Early access to deals", "Priority support", "Free pickup upgrades"] 
  },
  { 
    name: "Gold", 
    minPoints: 1500, 
    color: "bg-yellow-500", 
    textColor: "text-yellow-500",
    benefits: ["1.5x points multiplier", "Exclusive member deals", "Free items monthly", "VIP support"] 
  },
  { 
    name: "Platinum", 
    minPoints: 3000, 
    color: "bg-purple-400", 
    textColor: "text-purple-400",
    benefits: ["2x points multiplier", "Unlimited exclusive deals", "Free premium items", "Dedicated concierge", "Partner perks"] 
  },
];

// Pricing plans
const PLANS = [
  { 
    name: "Free", 
    price: 0, 
    features: ["Earn 1 point per $1", "Access to all deals", "Order tracking", "Basic support"],
    current: true
  },
  { 
    name: "Plus", 
    price: 4.99, 
    features: ["Everything in Free", "1.5x bonus points", "No service fees", "Priority pickup slots", "Exclusive deals"],
    recommended: true
  },
  { 
    name: "Premium", 
    price: 9.99, 
    features: ["Everything in Plus", "2x bonus points", "Free delivery on groceries", "Early access to new features", "Premium support"]
  },
];

interface UserRewards {
  total_points: number;
  lifetime_points: number;
  tier: string;
}

interface PointsTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  expires_at: string | null;
  created_at: string;
}

const Wallet = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [expiringPoints, setExpiringPoints] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedCards] = useState([
    { id: 1, last4: "4242", brand: "Visa", expiry: "12/25" },
    { id: 2, last4: "5555", brand: "Mastercard", expiry: "08/26" },
  ]);

  useEffect(() => {
    if (user) {
      fetchRewardsData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRewardsData = async () => {
    if (!user) return;

    try {
      // Fetch user rewards
      const { data: rewardsData } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (rewardsData) {
        setRewards(rewardsData);
      } else {
        // Create default rewards for new user
        const defaultRewards = { total_points: 0, lifetime_points: 0, tier: "bronze" };
        setRewards(defaultRewards);
      }

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from("points_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setTransactions(transactionsData || []);

      // Get expiring points (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiring = (transactionsData || []).filter(t => 
        t.expires_at && 
        new Date(t.expires_at) <= thirtyDaysFromNow && 
        new Date(t.expires_at) > new Date() &&
        t.points > 0
      );
      setExpiringPoints(expiring);

    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTier = () => {
    const points = rewards?.lifetime_points || 0;
    return TIERS.slice().reverse().find(t => points >= t.minPoints) || TIERS[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = TIERS.findIndex(t => t.name === currentTier.name);
    return TIERS[currentIndex + 1] || null;
  };

  const getPointsToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 0;
    return nextTier.minPoints - (rewards?.lifetime_points || 0);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <WalletIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Sign in to access your Wallet</h1>
          <p className="text-muted-foreground">Manage your rewards, payments, and more.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <WalletIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage payments & rewards</p>
          </div>
        </div>

        {/* Points Overview Card */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-primary">{rewards?.total_points || 0}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
              <Badge className={`${currentTier.color} text-white`}>
                <Crown className="h-3 w-3 mr-1" />
                {currentTier.name} Member
              </Badge>
            </div>
            
            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                  <span className="font-medium">{getPointsToNextTier()} points to go</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${nextTier.color} rounded-full transition-all`}
                    style={{ 
                      width: `${Math.min(100, ((rewards?.lifetime_points || 0) / nextTier.minPoints) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="rewards" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="rewards" className="text-xs sm:text-sm">
              <Gift className="h-4 w-4 mr-1 hidden sm:inline" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <History className="h-4 w-4 mr-1 hidden sm:inline" />
              History
            </TabsTrigger>
            <TabsTrigger value="tiers" className="text-xs sm:text-sm">
              <Crown className="h-4 w-4 mr-1 hidden sm:inline" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm">
              <CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            {/* Expiring Points Alert */}
            {expiringPoints.length > 0 && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-destructive text-base">
                    <AlertTriangle className="h-5 w-5" />
                    Points Expiring Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {expiringPoints.map((t) => (
                      <div key={t.id} className="flex justify-between items-center text-sm">
                        <span>{t.points} points</span>
                        <span className="text-muted-foreground">
                          Expires in {differenceInDays(new Date(t.expires_at!), new Date())} days
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="mt-3 w-full">Use Points Now</Button>
                </CardContent>
              </Card>
            )}

            {/* How to Earn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  How to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Every Order</p>
                      <p className="text-sm text-muted-foreground">Earn points on purchases</p>
                    </div>
                  </div>
                  <Badge variant="secondary">1pt / $1</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">First Order Bonus</p>
                      <p className="text-sm text-muted-foreground">Complete your first order</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+50 pts</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Tier Multiplier</p>
                      <p className="text-sm text-muted-foreground">Higher tiers earn more</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Up to 2x</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
                <CardDescription>Get more benefits with a paid plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PLANS.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      plan.recommended 
                        ? "border-primary bg-primary/5" 
                        : plan.current 
                          ? "border-muted bg-muted/30" 
                          : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        {plan.recommended && (
                          <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                        )}
                        {plan.current && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                      <p className="font-bold">
                        {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <Button 
                        size="sm" 
                        variant={plan.recommended ? "default" : "outline"}
                        className="mt-3 w-full"
                      >
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Points History
                </CardTitle>
                <CardDescription>Your recent points transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(transaction.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                            {transaction.expires_at && (
                              <p className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Expires {format(new Date(transaction.expires_at), "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                          <span className={`font-bold ${
                            transaction.points > 0 ? "text-green-500" : "text-destructive"
                          }`}>
                            {transaction.points > 0 ? "+" : ""}{transaction.points}
                          </span>
                        </div>
                        {index < transactions.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start earning points by placing orders!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Membership Tiers
                </CardTitle>
                <CardDescription>Unlock benefits as you earn more points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIERS.map((tier, index) => {
                  const isCurrentTier = tier.name.toLowerCase() === currentTier.name.toLowerCase();
                  const isUnlocked = (rewards?.lifetime_points || 0) >= tier.minPoints;
                  
                  return (
                    <div 
                      key={tier.name}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentTier 
                          ? "border-primary bg-primary/5" 
                          : isUnlocked
                            ? "border-muted bg-muted/30"
                            : "border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${tier.color} flex items-center justify-center`}>
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tier.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {tier.minPoints.toLocaleString()}+ lifetime points
                            </p>
                          </div>
                        </div>
                        {isCurrentTier && (
                          <Badge className="bg-primary text-primary-foreground">Current</Badge>
                        )}
                        {!isUnlocked && (
                          <Badge variant="outline" className="text-muted-foreground">
                            {tier.minPoints - (rewards?.lifetime_points || 0)} pts to unlock
                          </Badge>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Check className={`h-3 w-3 ${isUnlocked ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={isUnlocked ? "" : "text-muted-foreground"}>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Card
                  </Button>
                </div>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedCards.length > 0 ? (
                  savedCards.map((card, index) => (
                    <div key={card.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded bg-muted flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{card.brand} •••• {card.last4}</p>
                            <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      {index < savedCards.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No payment methods saved</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Add Your First Card
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Wallet;

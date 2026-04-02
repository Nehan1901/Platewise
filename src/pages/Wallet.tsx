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
  AlertTriangle,
  Trash2,
  Loader2
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

// Tier definitions
const TIERS = [
  { 
    name: "Bronze", 
    minPoints: 0, 
    color: "bg-amber-700", 
    textColor: "text-amber-700",
    benefits: ["10 points per $1 spent", "Basic rewards access", "Birthday bonus"] 
  },
  { 
    name: "Silver", 
    minPoints: 2000, 
    color: "bg-slate-400", 
    textColor: "text-slate-400",
    benefits: ["1.25x points multiplier", "Early access to deals", "Priority support", "Free pickup upgrades"] 
  },
  { 
    name: "Gold", 
    minPoints: 5000, 
    color: "bg-yellow-500", 
    textColor: "text-yellow-500",
    benefits: ["1.5x points multiplier", "Exclusive member deals", "Free items monthly", "VIP support"] 
  },
  { 
    name: "Platinum", 
    minPoints: 10000, 
    color: "bg-purple-400", 
    textColor: "text-purple-400",
    benefits: ["2x points multiplier", "Unlimited exclusive deals", "Free premium items", "Dedicated concierge", "Partner perks"] 
  },
];

// Pricing plans with Stripe price IDs (to be created)
const PLANS = [
  { 
    id: "free",
    name: "Free", 
    price: 0, 
    priceId: null,
    features: ["Earn 10 points per $1", "Access to all deals", "Order tracking", "Basic support"],
    current: true
  },
  { 
    id: "plus",
    name: "Plus", 
    price: 4.99, 
    priceId: null, // Will need to be created in Stripe
    features: ["Everything in Free", "1.5x bonus points", "No service fees", "Priority pickup slots", "Exclusive deals"],
    recommended: true
  },
  { 
    id: "premium",
    name: "Premium", 
    price: 9.99, 
    priceId: null, // Will need to be created in Stripe
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

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface SubscriptionInfo {
  subscribed: boolean;
  productId?: string;
  planName?: string;
  subscriptionEnd?: string;
}

const Wallet = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [expiringPoints, setExpiringPoints] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [deletingCard, setDeletingCard] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({ subscribed: false });
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRewardsData();
      fetchPaymentMethods();
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Check for subscription success/cancel from URL params
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      toast({
        title: "Subscription Activated!",
        description: "Thank you for upgrading. Enjoy your new benefits!",
      });
      checkSubscription();
    } else if (subscriptionStatus === 'cancelled') {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription was not completed.",
        variant: "destructive"
      });
    }
  }, [searchParams]);

  const fetchRewardsData = async () => {
    if (!user) return;

    try {
      const { data: rewardsData } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (rewardsData) {
        setRewards(rewardsData);
      } else {
        const defaultRewards = { total_points: 0, lifetime_points: 0, tier: "bronze" };
        setRewards(defaultRewards);
      }

      const { data: transactionsData } = await supabase
        .from("points_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setTransactions(transactionsData || []);

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

  const fetchPaymentMethods = async () => {
    if (!user) return;
    setCardsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods');
      
      if (error) throw error;
      
      if (data?.paymentMethods) {
        setSavedCards(data.paymentMethods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setCardsLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      if (data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setDeletingCard(cardId);
    
    try {
      const { error } = await supabase.functions.invoke('delete-payment-method', {
        body: { paymentMethodId: cardId }
      });
      
      if (error) throw error;
      
      setSavedCards(prev => prev.filter(c => c.id !== cardId));
      toast({
        title: "Card Removed",
        description: "Your payment method has been removed.",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Error",
        description: "Failed to remove card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingCard(null);
    }
  };

  const handleUpgradePlan = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      toast({
        title: "Coming Soon",
        description: `${planName} plan subscriptions will be available soon!`,
      });
      return;
    }

    setUpgradingPlan(planName);

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { priceId }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpgradingPlan(null);
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

  const getBrandIcon = (brand: string) => {
    return <CreditCard className="h-4 w-4 text-muted-foreground" />;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <PageHeader title="Wallet" />
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
      <PageHeader title="Wallet" />
      
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

            {subscription.subscribed && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Plan</span>
                  <Badge variant="secondary">{subscription.planName || 'Premium'}</Badge>
                </div>
                {subscription.subscriptionEnd && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Renews {format(new Date(subscription.subscriptionEnd), "MMM d, yyyy")}
                  </p>
                )}
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
                  <Badge variant="secondary">10pt / $1</Badge>
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
                {PLANS.map((plan) => {
                  const isCurrentPlan = subscription.subscribed 
                    ? subscription.planName?.toLowerCase() === plan.name.toLowerCase()
                    : plan.id === 'free';
                  
                  return (
                    <div 
                      key={plan.name}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        plan.recommended 
                          ? "border-primary bg-primary/5" 
                          : isCurrentPlan 
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
                          {isCurrentPlan && (
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
                      {!isCurrentPlan && plan.price > 0 && (
                        <Button 
                          size="sm" 
                          variant={plan.recommended ? "default" : "outline"}
                          className="mt-3 w-full"
                          onClick={() => handleUpgradePlan(plan.priceId, plan.name)}
                          disabled={upgradingPlan === plan.name}
                        >
                          {upgradingPlan === plan.name ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            `Upgrade to ${plan.name}`
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
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
                {TIERS.map((tier) => {
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
                </div>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {cardsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : savedCards.length > 0 ? (
                  savedCards.map((card, index) => (
                    <div key={card.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded bg-muted flex items-center justify-center">
                            {getBrandIcon(card.brand)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{card.brand} •••• {card.last4}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {card.expMonth}/{card.expYear}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCard(card.id)}
                          disabled={deletingCard === card.id}
                        >
                          {deletingCard === card.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                      {index < savedCards.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No payment methods saved</p>
                    <p className="text-sm mt-1">Cards will be saved when you complete a purchase</p>
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

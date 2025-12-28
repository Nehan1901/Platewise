import { useState } from "react";
import { CreditCard, Gift, Plus, Wallet as WalletIcon } from "lucide-react";
import Header from "@/components/shared/Header";
import BottomNav from "@/components/shared/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Wallet = () => {
  const [savedCards] = useState([
    { id: 1, last4: "4242", brand: "Visa", expiry: "12/25" },
    { id: 2, last4: "5555", brand: "Mastercard", expiry: "08/26" },
  ]);

  const [rewards] = useState({
    points: 250,
    tier: "Silver",
    nextTier: "Gold",
    pointsToNextTier: 250,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <WalletIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage payments & rewards</p>
          </div>
        </div>

        {/* Rewards Section */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Rewards
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {rewards.tier} Member
              </Badge>
            </div>
            <CardDescription>Earn points with every order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-primary">{rewards.points}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{rewards.pointsToNextTier} points to {rewards.nextTier}</p>
                <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all" 
                    style={{ width: `${(rewards.points / (rewards.points + rewards.pointsToNextTier)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Rewards History
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
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
      </main>

      <BottomNav />
    </div>
  );
};

export default Wallet;

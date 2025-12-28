import { useState } from "react";
import { Users, Copy, Share2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

const InviteFriends = () => {
  const [referralCode] = useState("PLATE2024");
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join PlateWise!",
        text: `Use my referral code ${referralCode} to get $5 off your first order on PlateWise!`,
        url: "https://platewise.app",
      });
    } else {
      copyReferralCode();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Invite your friends" />

      <div className="p-4 space-y-6">
        {/* Hero section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Give $5, Get $5
            </h2>
            <p className="text-sm opacity-90">
              Share PlateWise with friends and you'll both get $5 off your next order when they sign up!
            </p>
          </CardContent>
        </Card>

        {/* Referral code section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your referral code
            </h3>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <code className="text-lg font-mono font-bold">{referralCode}</code>
              <Button variant="outline" size="sm" onClick={copyReferralCode}>
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <Button className="w-full mt-4" onClick={shareReferral}>
              <Share2 className="h-4 w-4 mr-2" />
              Share with friends
            </Button>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">How it works</h3>
            <div className="space-y-4">
              {[
                { step: 1, text: "Share your unique referral code with friends" },
                { step: 2, text: "They sign up and make their first order" },
                { step: 3, text: "You both get $5 off your next order!" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Friends invited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">$0</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default InviteFriends;

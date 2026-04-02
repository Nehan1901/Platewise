import { useState } from "react";
import { Gift, Plus, Ticket, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface Voucher {
  id: string;
  code: string;
  discount: string;
  description: string;
  expiresAt: string;
  isUsed: boolean;
}

// Only these codes are valid and recognized by PlateWise
const VALID_VOUCHER_CODES = new Set(["WELCOME10", "SAVEFOOD25", "PLATEWISE50", "FIRSTORDER"]);

const Vouchers = () => {
  const [voucherCode, setVoucherCode] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [vouchers] = useState<Voucher[]>([
    {
      id: "1",
      code: "WELCOME10",
      discount: "10% OFF",
      description: "Welcome discount on your first order",
      expiresAt: "2025-02-28",
      isUsed: false,
    },
    {
      id: "2",
      code: "SAVEFOOD25",
      discount: "$2.50 OFF",
      description: "Save food, save money",
      expiresAt: "2025-01-31",
      isUsed: false,
    },
  ]);

  const handleRedeemVoucher = () => {
    if (isBlocked) {
      toast({
        title: "⛔ Redemption Blocked",
        description: "Too many invalid attempts. Please try again later or contact support.",
        variant: "destructive",
      });
      return;
    }

    const trimmed = voucherCode.trim().toUpperCase();

    if (!trimmed) {
      toast({
        title: "Enter a code",
        description: "Please enter a voucher code to redeem.",
        variant: "destructive",
      });
      return;
    }

    // Check if already redeemed
    const alreadyExists = vouchers.some((v) => v.code === trimmed);
    if (alreadyExists) {
      toast({
        title: "Already redeemed",
        description: "This voucher is already in your account.",
        variant: "destructive",
      });
      setVoucherCode("");
      return;
    }

    // Validate against known codes
    if (!VALID_VOUCHER_CODES.has(trimmed)) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsBlocked(true);
        toast({
          title: "⛔ Too many invalid attempts",
          description: "Voucher redemption has been temporarily disabled. Please contact support if you believe this is an error.",
          variant: "destructive",
        });
        // Auto-unblock after 5 minutes
        setTimeout(() => {
          setIsBlocked(false);
          setFailedAttempts(0);
        }, 5 * 60 * 1000);
      } else {
        toast({
          title: "Invalid voucher code",
          description: `This code is not recognized. Please check and try again. (${5 - newAttempts} attempts remaining)`,
          variant: "destructive",
        });
      }
      setVoucherCode("");
      return;
    }

    toast({
      title: "Voucher redeemed!",
      description: "The voucher has been added to your account.",
    });
    setFailedAttempts(0);
    setVoucherCode("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Vouchers" />

      <div className="p-4 space-y-6">
        {/* Redeem voucher section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Redeem a voucher
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter voucher code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={handleRedeemVoucher}>Redeem</Button>
            </div>
          </CardContent>
        </Card>

        {/* Available vouchers */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Your vouchers
          </h3>

          {vouchers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No vouchers available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a voucher code above to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vouchers.map((voucher) => (
                <Card key={voucher.id} className={voucher.isUsed ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary text-lg">
                            {voucher.discount}
                          </span>
                          {voucher.isUsed && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">
                              Used
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {voucher.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {voucher.code}
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Vouchers;

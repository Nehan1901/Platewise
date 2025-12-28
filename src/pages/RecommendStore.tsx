import { useState } from "react";
import { Store, Send, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

const RecommendStore = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName.trim() || !formData.storeAddress.trim()) {
      toast({
        title: "Required fields",
        description: "Please enter the store name and address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Thank you!",
        description: "We'll reach out to this store about joining PlateWise.",
      });
      setFormData({
        storeName: "",
        storeAddress: "",
        storePhone: "",
        storeEmail: "",
        reason: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Recommend a store" />

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Store Information
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Know a store that should be on PlateWise? Let us know and we'll reach out to them!
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store name *</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="Enter store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address *
                </Label>
                <Input
                  id="storeAddress"
                  value={formData.storeAddress}
                  onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                  placeholder="Enter store address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone (optional)
                </Label>
                <Input
                  id="storePhone"
                  type="tel"
                  value={formData.storePhone}
                  onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                  placeholder="Store phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email (optional)
                </Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={formData.storeEmail}
                  onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                  placeholder="Store email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why should they join? (optional)</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Tell us why this store would be great on PlateWise..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Submitting..." : "Submit Recommendation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default RecommendStore;

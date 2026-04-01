import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Store, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const RoleSelection = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const selectRole = async (role: "consumer" | "business") => {
    if (!user) return;
    setLoading(true);

    try {
      // Insert into user_roles table
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role });

      if (roleError) throw roleError;

      // Also update user metadata for quick access
      await supabase.auth.updateUser({
        data: { user_type: role === "consumer" ? "household" : "business" },
      });

      toast.success(`Welcome! You're set up as a ${role === "consumer" ? "customer" : "restaurant owner"}.`);
      navigate(role === "consumer" ? "/" : "/dashboard-business", { replace: true });
    } catch (error: any) {
      toast.error("Failed to set role", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <UtensilsCrossed className="h-10 w-10 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Welcome to PlateWise!</h1>
          <p className="text-muted-foreground">How will you be using PlateWise?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => !loading && selectRole("consumer")}
          >
            <CardHeader className="text-center">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle>I'm a Customer</CardTitle>
              <CardDescription>
                Browse surplus food from restaurants near you, save money and reduce waste.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button disabled={loading} className="w-full" onClick={(e) => { e.stopPropagation(); selectRole("consumer"); }}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => !loading && selectRole("business")}
          >
            <CardHeader className="text-center">
              <Store className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle>I'm a Restaurant Owner</CardTitle>
              <CardDescription>
                List surplus food, reduce waste, and earn extra revenue from items that would go unsold.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button disabled={loading} variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); selectRole("business"); }}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue as Restaurant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

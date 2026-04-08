import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, MapPin, Phone, Globe, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/shared/BottomNav";

const RestaurantPublicProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setLoading(true);
    fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const { data: bp } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      setProfile(bp);

      if (bp) {
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("business_id", bp.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(6);
        setListings(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Storefront Preview" />

        {loading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ) : !profile ? (
          <div className="text-center py-16 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-sans">Set up your business profile first</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {/* Profile Header */}
            <Card className="shadow-card overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-accent" />
              <CardContent className="pt-0 -mt-8">
                <div className="flex items-end gap-4">
                  {profile.logo_url ? (
                    <img src={profile.logo_url} alt="Logo" className="h-16 w-16 rounded-xl object-cover border-4 border-card shadow-card" />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-primary/10 border-4 border-card flex items-center justify-center">
                      <Store className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <div className="pb-1">
                    <h2 className="text-xl font-bold">{profile.business_name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs capitalize font-sans">{profile.business_type.replace("_", " ")}</Badge>
                      {profile.is_verified && <Badge className="text-xs">Verified</Badge>}
                    </div>
                  </div>
                </div>
                {profile.description && (
                  <p className="text-sm text-muted-foreground font-sans mt-4 leading-relaxed">{profile.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Contact & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-sans">{profile.address}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-sans">{profile.phone}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-primary shrink-0" />
                    <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm font-sans text-primary hover:underline">{profile.website}</a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Listings Preview */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Listings ({listings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-sans py-4 text-center">No active listings</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listings.map((l) => (
                      <div key={l.id} className="rounded-xl overflow-hidden border border-border">
                        <div className="h-20 bg-muted">
                          {l.image_urls && l.image_urls.length > 0 ? (
                            <img src={l.image_urls[0]} alt={l.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-semibold truncate">{l.title}</p>
                          <p className="text-xs text-primary font-bold">${Number(l.discounted_price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantPublicProfile;

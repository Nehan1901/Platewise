import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Package, Eye, EyeOff, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BottomNav from "@/components/shared/BottomNav";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  discounted_price: number;
  original_price: number;
  quantity_available: number;
  is_active: boolean;
  status: string;
  image_urls: string[] | null;
  item_type: string;
}

const MyListings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    setLoading(true);
    fetchListings();
  }, [user, authLoading]);

  const fetchListings = async () => {
    try {
      const { data: profile } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (profile) {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("business_id", profile.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setListings(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from("listings").update({ is_active: !isActive }).eq("id", id);
    if (error) {
      toast.error("Failed to update listing");
    } else {
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !isActive } : l)));
      toast.success(isActive ? "Listing deactivated" : "Listing activated");
    }
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing deleted");
    }
  };

  const discount = (orig: number, disc: number) => Math.round(((orig - disc) / orig) * 100);

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        <PageHeader title="My Listings" backTo="/dashboard-business" />

        <div className="flex justify-between items-center mt-4 mb-4">
          <p className="text-sm text-muted-foreground font-sans">{listings.length} listing{listings.length !== 1 ? "s" : ""}</p>
          <Button asChild className="rounded-full">
            <Link to="/create-listing"><PlusCircle className="h-4 w-4 mr-2" />Create New</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-accent/50 rounded-2xl p-8 inline-block">
              <Package className="h-16 w-16 mx-auto mb-4 text-primary/40" />
              <p className="text-lg mb-2 font-semibold">No listings yet</p>
              <p className="text-muted-foreground font-sans text-sm mb-4">Create your first listing to start saving food</p>
              <Button asChild className="rounded-full">
                <Link to="/create-listing">Create Your First Listing</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <Card key={listing.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 bg-muted">
                      {listing.image_urls && listing.image_urls.length > 0 ? (
                        <img
                          src={listing.image_urls[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => toggleActive(listing.id, listing.is_active)}>
                                {listing.is_active ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {listing.is_active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteListing(listing.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-xs text-muted-foreground font-sans capitalize">{listing.item_type.replace("_", " ")}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">${Number(listing.discounted_price).toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground line-through">${Number(listing.original_price).toFixed(2)}</span>
                          <Badge variant="secondary" className="text-xs h-5">-{discount(listing.original_price, listing.discounted_price)}%</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-sans">Qty: {listing.quantity_available}</span>
                          <Badge variant={listing.is_active ? "default" : "secondary"} className="text-xs h-5">
                            {listing.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default MyListings;

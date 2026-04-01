import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Package } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BottomNav from "@/components/shared/BottomNav";

interface Listing {
  id: string;
  title: string;
  discounted_price: number;
  original_price: number;
  quantity_available: number;
  is_active: boolean;
  status: string;
}

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchListings();
    else setLoading(false);
  }, [user]);

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

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 md:pb-6">
        <PageHeader title="My Listings" />

        <div className="flex justify-end mt-4 mb-4">
          <Button asChild>
            <Link to="/create-listing"><PlusCircle className="h-4 w-4 mr-2" />Create New</Link>
          </Button>
        </div>

        {loading ? (
          <Card><CardContent className="pt-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">No listings yet</p>
            <Button asChild><Link to="/create-listing">Create Your First Listing</Link></Button>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>
                        <span className="line-through text-muted-foreground text-xs mr-1">${Number(listing.original_price).toFixed(2)}</span>
                        ${Number(listing.discounted_price).toFixed(2)}
                      </TableCell>
                      <TableCell>{listing.quantity_available}</TableCell>
                      <TableCell>
                        <Badge variant={listing.is_active ? "default" : "secondary"}>
                          {listing.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => toggleActive(listing.id, listing.is_active)}>
                              {listing.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteListing(listing.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default MyListings;

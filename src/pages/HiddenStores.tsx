import { useState } from "react";
import { EyeOff, Eye, Store, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface HiddenStore {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
}

const HiddenStores = () => {
  const [hiddenStores, setHiddenStores] = useState<HiddenStore[]>([
    {
      id: "1",
      name: "Joe's Coffee",
      address: "123 Main St, San Francisco",
    },
    {
      id: "2",
      name: "Fresh Bakery",
      address: "456 Oak Ave, San Francisco",
    },
  ]);

  const unhideStore = (storeId: string) => {
    setHiddenStores((prev) => prev.filter((store) => store.id !== storeId));
    toast({
      title: "Store unhidden",
      description: "This store will now appear in your feed.",
    });
  };

  const unhideAll = () => {
    setHiddenStores([]);
    toast({
      title: "All stores unhidden",
      description: "All stores will now appear in your feed.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Hidden stores" />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {hiddenStores.length} store{hiddenStores.length !== 1 ? "s" : ""} hidden
          </p>
          {hiddenStores.length > 0 && (
            <Button variant="ghost" size="sm" onClick={unhideAll}>
              Unhide all
            </Button>
          )}
        </div>

        {hiddenStores.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No hidden stores</h3>
              <p className="text-sm text-muted-foreground">
                Stores you hide from your feed will appear here. You can unhide them anytime.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {hiddenStores.map((store) => (
              <Card key={store.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Store className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{store.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {store.address}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unhideStore(store.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Unhide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <EyeOff className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">How to hide stores</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap on a store in the Discover page, then tap the menu icon and select "Hide this store" to hide it from your feed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default HiddenStores;

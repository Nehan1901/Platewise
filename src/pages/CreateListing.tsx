import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import BottomNav from "@/components/shared/BottomNav";

const listingFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description is required."),
  itemType: z.enum(["prepared_food", "grocery"]),
  originalPrice: z.coerce.number().positive(),
  discountedPrice: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive(),
  quantityUnit: z.enum(["servings", "lbs", "units", "boxes"]),
  dietaryInfo: z.array(z.string()).optional(),
  allergenInfo: z.array(z.string()).optional(),
}).refine((d) => d.discountedPrice < d.originalPrice, {
  message: "Discounted price must be less than original price.",
  path: ["discountedPrice"],
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const dietaryOptions = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten-free", label: "Gluten-Free" },
];

const allergenOptions = [
  { id: "nuts", label: "Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "soy", label: "Soy" },
  { id: "wheat", label: "Wheat" },
  { id: "eggs", label: "Eggs" },
];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: { dietaryInfo: [], allergenInfo: [], quantityUnit: "servings", itemType: "prepared_food" },
  });

  useEffect(() => {
    if (user) {
      supabase.from("business_profiles").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setBusinessId(data.id);
        else {
          toast.error("Please set up your business profile first.");
          navigate("/business-profile");
        }
      });
    }
  }, [user]);

  const onSubmit = async (values: ListingFormValues) => {
    if (!user || !businessId) return;
    setLoading(true);

    try {
      // Upload images
      const imageUrls: string[] = [];
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const ext = file.name.split(".").pop();
          const path = `${businessId}/${Date.now()}-${i}.${ext}`;
          const { error } = await supabase.storage.from("listing-images").upload(path, file);
          if (!error) {
            const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
            imageUrls.push(data.publicUrl);
          }
        }
      }

      const { error } = await supabase.from("listings").insert({
        business_id: businessId,
        title: values.title,
        description: values.description,
        item_type: values.itemType,
        original_price: values.originalPrice,
        discounted_price: values.discountedPrice,
        quantity_available: values.quantity,
        quantity_unit: values.quantityUnit,
        image_urls: imageUrls,
        dietary_info: values.dietaryInfo || [],
        allergen_info: values.allergenInfo || [],
        pickup_start_time: new Date().toISOString(),
        pickup_end_time: new Date(Date.now() + 86400000).toISOString(),
      });

      if (error) throw error;
      toast.success("Listing created!");
      navigate("/my-listings");
    } catch (error: any) {
      toast.error("Failed to create listing", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Create Listing" />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>New Surplus Item</CardTitle>
            <CardDescription>Add a new item that customers can purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Lunch Special Pasta" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="itemType" render={({ field }) => (
                  <FormItem className="space-y-3"><FormLabel>Item Type</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="prepared_food" /></FormControl><FormLabel className="font-normal">Prepared Food</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="grocery" /></FormControl><FormLabel className="font-normal">Grocery</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="originalPrice" render={({ field }) => (
                    <FormItem><FormLabel>Original Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="discountedPrice" render={({ field }) => (
                    <FormItem><FormLabel>Discounted Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="quantityUnit" render={({ field }) => (
                    <FormItem><FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="servings">Servings</SelectItem>
                          <SelectItem value="lbs">Pounds</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="space-y-2">
                  <FormLabel>Images</FormLabel>
                  <Input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} />
                  <FormDescription>Upload one or more images.</FormDescription>
                </div>
                <FormField control={form.control} name="dietaryInfo" render={() => (
                  <FormItem>
                    <FormLabel>Dietary Info</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {dietaryOptions.map((item) => (
                        <FormField key={item.id} control={form.control} name="dietaryInfo" render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((v) => v !== item.id));
                              }} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="allergenInfo" render={() => (
                  <FormItem>
                    <FormLabel>Allergen Info</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {allergenOptions.map((item) => (
                        <FormField key={item.id} control={form.control} name="allergenInfo" render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((v) => v !== item.id));
                              }} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </FormItem>
                )} />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Listing
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </>
  );
};

export default CreateListing;

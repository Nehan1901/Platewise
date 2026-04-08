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
import { Loader2, ImagePlus, X } from "lucide-react";
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
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
];

const allergenOptions = [
  { id: "nuts", label: "Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "soy", label: "Soy" },
  { id: "wheat", label: "Wheat" },
  { id: "eggs", label: "Eggs" },
  { id: "shellfish", label: "Shellfish" },
];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);

    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const onSubmit = async (values: ListingFormValues) => {
    if (!user || !businessId) return;
    setLoading(true);

    try {
      const imageUrls: string[] = [];
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

  const watchOriginal = form.watch("originalPrice");
  const watchDiscount = form.watch("discountedPrice");
  const savings = watchOriginal && watchDiscount && watchOriginal > watchDiscount
    ? Math.round(((watchOriginal - watchDiscount) / watchOriginal) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Create Listing" backTo="/dashboard-business" />
        <Card className="mt-4 shadow-card">
          <CardHeader>
            <CardTitle>New Surplus Item</CardTitle>
            <CardDescription className="font-sans">Add a new item that customers can purchase at a discount.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Lunch Special Pasta" {...field} className="font-sans" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="What's included, freshness, special notes..." {...field} className="font-sans" rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="itemType" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Item Type</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="prepared_food" /></FormControl>
                          <FormLabel className="font-sans font-normal">Prepared Food</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="grocery" /></FormControl>
                          <FormLabel className="font-sans font-normal">Grocery</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="originalPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} className="font-sans" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="discountedPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} className="font-sans" /></FormControl>
                      {savings > 0 && <p className="text-xs text-primary font-sans font-medium">{savings}% off</p>}
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl><Input type="number" {...field} className="font-sans" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantityUnit" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="font-sans"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="servings">Servings</SelectItem>
                          <SelectItem value="lbs">Pounds</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Images (up to 5)</FormLabel>
                  <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.length < 5 && (
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <ImagePlus className="h-5 w-5 text-muted-foreground" />
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                  <FormDescription className="font-sans text-xs">Upload clear photos of the food items.</FormDescription>
                </div>

                <FormField control={form.control} name="dietaryInfo" render={() => (
                  <FormItem>
                    <FormLabel>Dietary Info</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {dietaryOptions.map((item) => (
                        <FormField key={item.id} control={form.control} name="dietaryInfo" render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((v) => v !== item.id));
                              }} />
                            </FormControl>
                            <FormLabel className="font-sans font-normal text-sm">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="allergenInfo" render={() => (
                  <FormItem>
                    <FormLabel>Allergen Info</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {allergenOptions.map((item) => (
                        <FormField key={item.id} control={form.control} name="allergenInfo" render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((v) => v !== item.id));
                              }} />
                            </FormControl>
                            <FormLabel className="font-sans font-normal text-sm">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <Button type="submit" disabled={loading} className="w-full rounded-full">
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

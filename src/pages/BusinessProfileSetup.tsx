import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Store, ImagePlus, X } from "lucide-react";
import BottomNav from "@/components/shared/BottomNav";

const profileFormSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  businessType: z.enum(["restaurant", "hotel", "grocery_store", "cafe", "bakery"]),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const BusinessProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { businessName: "", businessType: "restaurant", description: "", address: "", phone: "", website: "" },
  });

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (data) {
      setExistingProfile(data);
      setLogoPreview(data.logo_url);
      form.reset({
        businessName: data.business_name,
        businessType: data.business_type as any,
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
        website: data.website || "",
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      let logoUrl = existingProfile?.logo_url;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage.from("listing-images").upload(path, logoFile, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
          logoUrl = urlData.publicUrl;
        }
      }

      const profileData = {
        user_id: user.id,
        business_name: values.businessName,
        business_type: values.businessType,
        description: values.description || null,
        address: values.address,
        phone: values.phone,
        website: values.website || null,
        logo_url: logoUrl,
      };

      if (existingProfile) {
        const { error } = await supabase.from("business_profiles").update(profileData).eq("id", existingProfile.id);
        if (error) throw error;
        toast.success("Profile updated!");
      } else {
        const { error } = await supabase.from("business_profiles").insert(profileData);
        if (error) throw error;
        toast.success("Profile created!");
      }
      navigate("/dashboard-business");
    } catch (error: any) {
      toast.error("Error saving profile", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Business Profile" />
        <Card className="mt-4 shadow-card">
          <CardHeader>
            <CardTitle>{existingProfile ? "Edit" : "Set Up"} Your Restaurant</CardTitle>
            <CardDescription className="font-sans">This information will be visible to customers browsing your listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Logo Upload */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Logo" className="h-20 w-20 rounded-xl object-cover border border-border" />
                        <button
                          type="button"
                          onClick={() => { setLogoFile(null); setLogoPreview(existingProfile?.logo_url || null); }}
                          className="absolute -top-1 -right-1 bg-background border border-border rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Restaurant Logo</p>
                    <p className="text-xs text-muted-foreground font-sans">Square image works best</p>
                  </div>
                </div>

                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="Your Restaurant Name" {...field} className="font-sans" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="businessType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="font-sans"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="grocery_store">Grocery Store</SelectItem>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Tell customers about your restaurant..." {...field} className="font-sans" rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="123 Main Street, City, State" {...field} className="font-sans" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="(123) 456-7890" {...field} className="font-sans" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl><Input placeholder="https://www.yoursite.com" {...field} className="font-sans" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {existingProfile ? "Update Profile" : "Create Profile"}
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

export default BusinessProfileSetup;

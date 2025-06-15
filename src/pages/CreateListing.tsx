
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Header from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const listingFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Description is required."),
    itemType: z.enum(["prepared_food", "grocery"], { required_error: "Please select an item type."}),
    originalPrice: z.coerce.number({required_error: "Original price is required."}).positive(),
    discountedPrice: z.coerce.number({required_error: "Discounted price is required."}).positive(),
    quantity: z.coerce.number({required_error: "Quantity is required."}).int().positive(),
    quantityUnit: z.enum(["servings", "lbs", "units", "boxes"], { required_error: "Please select a unit."}),
    images: z.any().optional(),
    pickupStart: z.date({ required_error: "Pickup start date is required."}),
    pickupEnd: z.date({ required_error: "Pickup end date is required."}),
    dietaryInfo: z.array(z.string()).optional(),
    allergenInfo: z.array(z.string()).optional(),
}).refine(data => data.discountedPrice < data.originalPrice, {
    message: "Discounted price must be less than original price.",
    path: ["discountedPrice"],
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const dietaryOptions = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'gluten-free', label: 'Gluten-Free' },
];

const allergenOptions = [
    { id: 'nuts', label: 'Nuts' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'soy', label: 'Soy' },
];

const CreateListing = () => {
    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            dietaryInfo: [],
            allergenInfo: [],
        }
    });

    function onSubmit(data: ListingFormValues) {
        console.log("New Listing Data:", data);
        toast.success("Listing Created!", {
            description: "Your new listing is now available. (This is a demo)",
        });
    }

    return (
        <>
            <Header />
            <main className="container mx-auto py-10">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Listing</CardTitle>
                        <CardDescription>
                            Add a new surplus item that will be available for household users to purchase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Lunch Special Pasta" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the item" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="itemType" render={({ field }) => ( <FormItem className="space-y-3"><FormLabel>Item Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="prepared_food" /></FormControl><FormLabel className="font-normal">Prepared Food</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="grocery" /></FormControl><FormLabel className="font-normal">Grocery</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <FormField control={form.control} name="originalPrice" render={({ field }) => ( <FormItem><FormLabel>Original Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="discountedPrice" render={({ field }) => ( <FormItem><FormLabel>Discounted Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem><FormLabel>Quantity Available</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="quantityUnit" render={({ field }) => ( <FormItem><FormLabel>Quantity Unit</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a unit" /></SelectTrigger></FormControl><SelectContent><SelectItem value="servings">servings</SelectItem><SelectItem value="lbs">lbs</SelectItem><SelectItem value="units">units</SelectItem><SelectItem value="boxes">boxes</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                </div>
                                <FormField control={form.control} name="images" render={({ field }) => ( <FormItem><FormLabel>Images</FormLabel><FormControl><Input type="file" multiple accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormDescription>Upload one or more images of the item.</FormDescription><FormMessage /></FormItem>)} />
                                <div className="grid md:grid-cols-2 gap-8">
                                    <FormField control={form.control} name="pickupStart" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Pickup Start Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="pickupEnd" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Pickup End Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                </div>
                                <FormField control={form.control} name="dietaryInfo" render={() => ( <FormItem><div className="mb-4"><FormLabel className="text-base">Dietary Info</FormLabel><FormDescription>Select all that apply.</FormDescription></div>{dietaryOptions.map((item) => (<FormField key={item.id} control={form.control} name="dietaryInfo" render={({ field }) => { return (<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 mb-2"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="allergenInfo" render={() => ( <FormItem><div className="mb-4"><FormLabel className="text-base">Allergen Info</FormLabel><FormDescription>Select all that apply.</FormDescription></div>{allergenOptions.map((item) => (<FormField key={item.id} control={form.control} name="allergenInfo" render={({ field }) => { return (<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 mb-2"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />
                                <div className="flex gap-4">
                                    <Button type="submit">Create Listing</Button>
                                    <Button variant="outline" asChild><Link to="/dashboard-business">Cancel</Link></Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}

export default CreateListing;

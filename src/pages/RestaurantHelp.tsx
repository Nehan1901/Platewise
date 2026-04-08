import { useState } from "react";
import Header from "@/components/shared/Header";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageSquare, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/shared/BottomNav";

const faqs = [
  { q: "How do I create a listing?", a: "Go to your Dashboard → Add Listing. Fill in the item details, upload images, set the price and pickup time, then publish." },
  { q: "How do I manage incoming orders?", a: "Navigate to Order Management from your dashboard. You can confirm, mark as picked up, or cancel orders from there." },
  { q: "How are payouts processed?", a: "Payouts are processed weekly to your connected bank account. You can view your earnings in the Earnings section." },
  { q: "Can I edit a listing after publishing?", a: "Currently you can activate/deactivate or delete listings. Full editing support is coming soon." },
  { q: "What happens when a customer cancels?", a: "The order is marked as cancelled and the item quantity is restored. You'll receive a notification." },
  { q: "How do I verify my business?", a: "Business verification happens automatically once you complete your profile and make your first sale." },
];

const RestaurantHelp = () => {
  const [search, setSearch] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!contactMessage.trim()) return;
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setContactMessage("");
  };

  return (
    <>
      <Header />
      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24 md:pb-6">
        <PageHeader title="Help & Support" backTo="/dashboard-business" />

        {/* Search */}
        <div className="relative mt-4 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full font-sans"
          />
        </div>

        {/* FAQs */}
        <Card className="shadow-card mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.length === 0 ? (
                <p className="text-sm text-muted-foreground font-sans py-4 text-center">No matching questions found</p>
              ) : (
                filteredFaqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm font-sans text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-sans">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-card mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Contact Us</h2>
            </div>
            <Textarea
              placeholder="Describe your issue or question..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="font-sans mb-3"
              rows={4}
            />
            <Button onClick={sendMessage} className="w-full rounded-full">Send Message</Button>
          </CardContent>
        </Card>

        {/* Quick Contact */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4 text-center">
              <Mail className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold">Email</p>
              <p className="text-xs text-muted-foreground font-sans">support@platewise.com</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4 text-center">
              <Phone className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-xs text-muted-foreground font-sans">1-800-PLATE-01</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </>
  );
};

export default RestaurantHelp;

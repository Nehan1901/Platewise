import { Leaf, Store, ShoppingBag, MapPin, Clock, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Find nearby stores",
      description: "Discover restaurants, bakeries, and grocery stores near you with surplus food available at discounted prices.",
    },
    {
      icon: ShoppingBag,
      title: "Browse & order",
      description: "Browse available surprise bags and meals. Order and pay securely through the app.",
    },
    {
      icon: Clock,
      title: "Pick up your food",
      description: "Show your pickup code at the store during the designated pickup window and collect your food.",
    },
    {
      icon: Smile,
      title: "Enjoy & save",
      description: "Enjoy delicious food at a fraction of the price while helping reduce food waste!",
    },
  ];

  const benefits = [
    {
      icon: Leaf,
      title: "Reduce food waste",
      description: "Help prevent perfectly good food from going to waste",
    },
    {
      icon: Store,
      title: "Support local businesses",
      description: "Help local stores recover costs on surplus food",
    },
    {
      icon: ShoppingBag,
      title: "Save money",
      description: "Get great food at up to 70% off retail prices",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="How PlateWise works" />

      <div className="p-4 space-y-6">
        {/* Hero section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <Leaf className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Save food, save money
            </h2>
            <p className="text-sm opacity-90">
              PlateWise connects you with local stores to rescue surplus food at amazing prices.
            </p>
          </CardContent>
        </Card>

        {/* How it works steps */}
        <div>
          <h3 className="font-semibold mb-4">How it works</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold">{step.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-4">Why use PlateWise?</h3>
          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HowItWorks;

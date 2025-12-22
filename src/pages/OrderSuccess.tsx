import { useNavigate } from "react-router-dom";
import { Check, Clock, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
}

const timelineSteps: TimelineStep[] = [
  {
    id: "1",
    title: "Order accepted",
    description: "Wait for the collection time",
    icon: <Check className="h-4 w-4" />,
    isCompleted: true,
    isActive: false,
  },
  {
    id: "2",
    title: "Preparing pick by driver",
    description: "We started process your orders. The order will be ready accepted by driver soon",
    icon: <Package className="h-4 w-4" />,
    isCompleted: false,
    isActive: true,
  },
  {
    id: "3",
    title: "Ready to delivery",
    description: "Driver send you order",
    icon: <Truck className="h-4 w-4" />,
    isCompleted: false,
    isActive: false,
  },
];

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(30,30%,96%)] pb-32 flex flex-col">
      {/* Success Illustration */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center pt-16 pb-8 px-4">
        {/* Decorative circles */}
        <div className="relative w-40 h-40">
          {/* Outer decorative dots */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[hsl(var(--accent))]/30"
                style={{
                  top: `${50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
          {/* Inner circle decorations */}
          <div className="absolute inset-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-[hsl(var(--accent))]/20"
                style={{
                  top: `${50 + 40 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                  left: `${50 + 40 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
          {/* Center check circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-[hsl(var(--accent))] flex items-center justify-center">
              <Check className="h-10 w-10 text-[hsl(var(--accent))] stroke-[3]" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-8 text-center">Thank you for your order!</h1>
        <p className="text-muted-foreground text-center mt-2 px-8">
          You can track your order easily by clicking the button below to view updates.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 px-6 py-4">
        <div className="space-y-0">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.isCompleted
                      ? "bg-[hsl(var(--accent))] text-accent-foreground"
                      : step.isActive
                      ? "bg-muted border-2 border-[hsl(var(--accent))]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 ${
                      step.isCompleted ? "bg-[hsl(var(--accent))]" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-8">
                <h3
                  className={`font-semibold ${
                    step.isCompleted || step.isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[hsl(30,30%,96%)]">
        <div className="space-y-3">
          <Button
            className="w-full h-14 rounded-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-accent-foreground font-semibold"
            onClick={() => navigate("/orders")}
          >
            Track my order
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-full font-semibold"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5 mr-2" />
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

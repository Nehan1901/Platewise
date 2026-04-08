import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[320px] md:h-[420px]">
        <img
          src={heroImage}
          alt="Fresh surplus food spread on a rustic wooden table"
          className="w-full h-full object-cover"
          width={1920}
          height={800}
        />
        {/* Bottom fade - uses a solid-to-transparent gradient that works in both modes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(38,40%,96%)] via-[hsl(38,40%,96%)]/50 to-transparent dark:from-[hsl(30,15%,8%)] dark:via-[hsl(30,15%,8%)]/50 dark:to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-6 md:pb-8">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-lg text-[hsl(152,45%,15%)] dark:text-foreground">
            Rescue food,
            <br />
            <span className="text-primary italic">save the planet.</span>
          </h1>
          <p className="mt-2 text-sm md:text-base max-w-md text-[hsl(30,10%,30%)] dark:text-muted-foreground">
            Surplus meals from top restaurants at up to 70% off. Pick up before it goes to waste.
          </p>
          <Button
            onClick={() => navigate("/discover")}
            className="mt-4 rounded-full px-6 font-sans"
          >
            Explore nearby <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

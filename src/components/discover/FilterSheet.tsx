import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface FilterState {
  dietaryPreferences: string[];
  priceRange: [number, number];
  distance: number;
  pickupTime: string;
}

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Dairy-Free",
];

const pickupTimeOptions = [
  { value: "any", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "next_hour", label: "Next hour" },
];

const FilterSheet = ({ open, onOpenChange, filters, onApplyFilters }: FilterSheetProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const toggleDietaryPreference = (pref: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter((p) => p !== pref)
        : [...prev.dietaryPreferences, pref],
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      dietaryPreferences: [],
      priceRange: [0, 50],
      distance: 10,
      pickupTime: "any",
    };
    setLocalFilters(defaultFilters);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0">
        <SheetHeader className="px-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-primary font-medium"
            >
              Reset
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Price Range</h3>
            <div className="px-2">
              <Slider
                value={localFilters.priceRange}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${localFilters.priceRange[0]}</span>
                <span>${localFilters.priceRange[1]}+</span>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Distance</h3>
            <div className="px-2">
              <Slider
                value={[localFilters.distance]}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    distance: value[0],
                  }))
                }
                max={25}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>1 mi</span>
                <span>{localFilters.distance} mi</span>
              </div>
            </div>
          </div>

          {/* Pickup Time */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Pickup Time</h3>
            <div className="flex flex-wrap gap-2">
              {pickupTimeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      pickupTime: option.value,
                    }))
                  }
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    localFilters.pickupTime === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((pref) => {
                const isSelected = localFilters.dietaryPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    onClick={() => toggleDietaryPreference(pref)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary"
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-6 py-4 border-t border-border bg-background">
          <Button
            onClick={handleApply}
            className="w-full h-12 rounded-xl text-base font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;

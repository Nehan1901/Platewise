import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "meals", label: "Meals" },
  { id: "bread", label: "Bread & Pastries" },
  { id: "groceries", label: "Groceries" },
  { id: "sushi", label: "Sushi" },
  { id: "pizza", label: "Pizza" },
  { id: "desserts", label: "Desserts" },
];

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters = ({ selectedCategory, onCategoryChange }: CategoryFiltersProps) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex gap-2 px-4 md:px-6 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-foreground text-background shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;

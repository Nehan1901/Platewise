import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  Croissant, 
  ShoppingBasket, 
  Fish, 
  Pizza, 
  Cake 
} from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "meals", label: "Meals", icon: UtensilsCrossed },
  { id: "bread", label: "Bread & Pastries", icon: Croissant },
  { id: "groceries", label: "Groceries", icon: ShoppingBasket },
  { id: "sushi", label: "Sushi", icon: Fish },
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "desserts", label: "Desserts", icon: Cake },
];

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters = ({ selectedCategory, onCategoryChange }: CategoryFiltersProps) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2">
      <div className="flex gap-3 px-4 md:px-6 min-w-max">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                selectedCategory === category.id
                  ? "bg-foreground text-background shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilters;

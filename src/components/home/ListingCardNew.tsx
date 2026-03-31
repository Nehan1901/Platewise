import { Heart, Star, Clock, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ListingCardNewProps {
  listing: {
    id: string;
    title: string;
    original_price: number;
    discounted_price: number;
    image_url: string;
    images?: string[];
    business_name: string;
    business_logo?: string;
    distance?: number;
    pickup_time?: string;
    items_left?: number;
    rating?: number;
    bag_type?: string;
  };
  badge?: string;
}

const ListingCardNew = ({ listing, badge }: ListingCardNewProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  
  // Use images array or fallback to single image
  const images = listing.images || [listing.image_url];
  
  // Generate a consistent rating between 3.5-4.9 based on listing id
  const rating = listing.rating || (3.5 + (parseInt(listing.id) * 0.3) % 1.4).toFixed(1);
  const bagType = listing.bag_type || "Surprise Bag";

  // Auto-scroll on hover
  useEffect(() => {
    if (isHovering && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, images.length]);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Touch/drag handlers for image carousel
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    
    const diffX = e.clientX - dragStartRef.current.x;
    const diffY = e.clientY - dragStartRef.current.y;
    
    // If significant horizontal drag, change image
    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
      hasDraggedRef.current = true;
      if (diffX < 0) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    
    dragStartRef.current = null;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if we just dragged
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    navigate(`/listing/${listing.id}`);
  };

  return (
    <article className="group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div 
        className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Images */}
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${listing.title} ${idx + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              draggable={false}
            />
          ))}
        </div>
        
        {/* Navigation Arrows - Show on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-opacity duration-300",
                isHovering ? "opacity-100" : "opacity-0"
              )}
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-opacity duration-300",
                isHovering ? "opacity-100" : "opacity-0"
              )}
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
        
        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  idx === currentImageIndex 
                    ? "bg-white w-4" 
                    : "bg-white/60 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Free Badge */}
        {listing.discounted_price === 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
            Free
          </div>
        )}
        
        {/* Ending Soon Badge - only show if not free */}
        {badge && listing.discounted_price > 0 && (
          <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
        
      </div>
      
      {/* Content */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
            {listing.business_name}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className="flex-shrink-0 p-1 -m-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite(listing.id) 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )} 
            />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground">{bagType}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {listing.pickup_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Pick up today {listing.pickup_time}
            </span>
          )}
          {listing.distance !== undefined && (
            <>
              <span className="text-border">|</span>
              <span>{listing.distance.toFixed(1)} mi</span>
            </>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-dashed border-border mt-2">
          {listing.discounted_price === 0 ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${listing.original_price.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-green-500">
                FREE
              </span>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${listing.original_price.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-foreground">
                ${listing.discounted_price.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default ListingCardNew;

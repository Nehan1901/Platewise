import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ListingMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
}

const ListingMap = ({ latitude, longitude, businessName }: ListingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    const loadMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.default.accessToken = mapboxToken;

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [longitude, latitude],
          zoom: 15,
        });

        // Add marker
        new mapboxgl.default.Marker({ color: "#16a34a" })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${businessName}</strong>`))
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), "top-right");

        setIsMapLoaded(true);
        setShowTokenInput(false);
      } catch (error) {
        console.error("Error loading map:", error);
        toast.error("Failed to load map. Please check your Mapbox token.");
        setMapboxToken("");
      }
    };

    loadMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, latitude, longitude, businessName]);

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast.error("Please enter a valid Mapbox token");
      return;
    }
    // Token will trigger useEffect to load the map
    setShowTokenInput(false);
  };

  if (showTokenInput && !isMapLoaded) {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span>Enter your Mapbox token to view the map</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Get your free token at{" "}
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit}>Load Map</Button>
        </div>
        
        {/* Static map preview using coordinates */}
        <div className="mt-4 rounded-lg overflow-hidden border">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              <img
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+16a34a(${longitude},${latitude})/${longitude},${latitude},14,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                alt="Map preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="font-medium">{businessName}</p>
                  <p className="text-sm text-muted-foreground">Click to open in Google Maps</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border h-[250px]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ListingMap;
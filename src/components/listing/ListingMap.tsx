import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
}

const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const ListingMap = ({ latitude, longitude, businessName }: ListingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const loadMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.default.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [longitude, latitude],
          zoom: 15,
        });

        new mapboxgl.default.Marker({ color: "#2d6a4f" })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${businessName}</strong>`))
          .addTo(map.current);

        map.current.addControl(new mapboxgl.default.NavigationControl(), "top-right");
        setIsMapLoaded(true);
      } catch (error) {
        console.error("Error loading map:", error);
        setMapError(true);
      }
    };

    loadMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, businessName]);

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  if (mapError) {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="aspect-video flex items-center justify-center p-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">{businessName}</p>
              <p className="text-sm text-muted-foreground mt-1">Tap to open in Google Maps</p>
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl overflow-hidden border border-border h-[250px]">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      {isMapLoaded && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </Button>
      )}
    </div>
  );
};

export default ListingMap;

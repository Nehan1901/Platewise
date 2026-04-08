import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface ListingMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
}

const MAPBOX_TOKEN = "pk.eyJ1IjoibmVoYW5hbmFnYW0iLCJhIjoiY21uZGljNDMzMWdrZTJwbjV3ZGRlbGpiaiJ9.xFsLczax-6ktxCtLsikglg";

const LIGHT_STYLE = "mapbox://styles/mapbox/streets-v12";
const DARK_STYLE = "mapbox://styles/mapbox/navigation-night-v1";

const ListingMap = ({ latitude, longitude, businessName }: ListingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const { theme } = useTheme();

  const resolvedTheme = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Remove old map if style changed
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    const loadMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.default.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE,
          center: [longitude, latitude],
          zoom: 15,
          attributionControl: false,
        });

        map.current.addControl(
          new mapboxgl.default.AttributionControl({ compact: true }),
          "bottom-right"
        );

        // Custom marker element
        const markerEl = document.createElement("div");
        markerEl.innerHTML = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 14.4 23.2 15.2 24 .4.4 1.2.4 1.6 0C17.6 39.2 32 26 32 16 32 7.163 24.837 0 16 0z" fill="${resolvedTheme === 'dark' ? '#6bbf8a' : '#2d6a4f'}"/>
          <circle cx="16" cy="15" r="6" fill="white"/>
        </svg>`;
        markerEl.style.cursor = "pointer";

        new mapboxgl.default.Marker({ element: markerEl, anchor: "bottom" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.default.Popup({ offset: 25, closeButton: false })
              .setHTML(`<div style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;padding:2px 4px;">${businessName}</div>`)
          )
          .addTo(map.current);

        map.current.addControl(
          new mapboxgl.default.NavigationControl({ showCompass: false }),
          "top-right"
        );

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
  }, [latitude, longitude, businessName, resolvedTheme]);

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  if (mapError) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
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
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-[280px]">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      {isMapLoaded && (
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl border-border hover:bg-accent"
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

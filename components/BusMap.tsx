import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import type { BusLocationUpdate } from "../server/websocket";

interface BusMapProps {
  tripId: number;
  origin: { latitude: number; longitude: number; name: string };
  destination: { latitude: number; longitude: number; name: string };
  currentLocation?: { latitude: number; longitude: number };
  stops?: Array<{ latitude: number; longitude: number; name: string }>;
  onMapReady?: (map: google.maps.Map) => void;
}

export const BusMap: React.FC<BusMapProps> = ({
  tripId,
  origin,
  destination,
  currentLocation,
  stops = [],
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: origin,
      mapTypeId: "roadmap",
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add origin marker
    const originMarker = new window.google.maps.Marker({
      position: origin,
      map,
      title: `Origin: ${origin.name}`,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });
    markersRef.current.push(originMarker);

    // Add destination marker
    const destMarker = new window.google.maps.Marker({
      position: destination,
      map,
      title: `Destination: ${destination.name}`,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });
    markersRef.current.push(destMarker);

    // Add stop markers
    stops.forEach((stop) => {
      const stopMarker = new window.google.maps.Marker({
        position: { lat: stop.latitude, lng: stop.longitude },
        map,
        title: `Stop: ${stop.name}`,
        icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      });
      markersRef.current.push(stopMarker);
    });

    // Draw route polyline
    const routePoints = [
      origin,
      ...stops.map((s) => ({ lat: s.latitude, lng: s.longitude })),
      destination,
    ];

    polylineRef.current = new window.google.maps.Polyline({
      path: routePoints,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map,
    });

    // Fit bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    stops.forEach((stop) => {
      bounds.extend({ lat: stop.latitude, lng: stop.longitude });
    });
    map.fitBounds(bounds);

    setIsLoading(false);
    onMapReady?.(map);

    return () => {
      // Cleanup
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylineRef.current?.setMap(null);
    };
  }, [origin, destination, stops, onMapReady]);

  // Update current location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return;

    // Remove old bus marker if exists
    const oldBusMarker = markersRef.current.find((m) => m.getTitle()?.includes("Bus"));
    if (oldBusMarker) {
      oldBusMarker.setMap(null);
      markersRef.current = markersRef.current.filter((m) => m !== oldBusMarker);
    }

    // Add new bus marker
    const busMarker = new window.google.maps.Marker({
      position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
      map: mapInstanceRef.current,
      title: "Current Bus Location",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      animation: window.google.maps.Animation.DROP,
    });

    markersRef.current.push(busMarker);

    // Center map on bus
    mapInstanceRef.current.panTo(busMarker.getPosition()!);
  }, [currentLocation]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
        }}
      />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}
    </View>
  );
};

export default BusMap;

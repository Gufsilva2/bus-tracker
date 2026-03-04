import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Share, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useWebSocket } from "../../hooks/use-websocket";
import BusMap from "../../components/BusMap";
import type { PublicTripData } from "../../server/public-sharing";

/**
 * Public shared trip page
 * Passengers can view trip details and real-time tracking without login
 */

export default function SharedTripPage() {
  const { shareId } = useLocalSearchParams<{ shareId: string }>();
  const [tripData, setTripData] = useState<PublicTripData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { subscribeTo, unsubscribeFrom, onLocationUpdate } = useWebSocket({
    autoConnect: true,
  });

  // Load trip data
  useEffect(() => {
    if (!shareId) return;

    const loadTripData = async () => {
      try {
        setIsLoading(true);
        // TODO: Fetch public trip data
        // const response = await fetch(`/api/public/trips/${shareId}`);
        // const data = await response.json();
        // setTripData(data);
      } catch (err) {
        setError("Failed to load trip data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTripData();
  }, [shareId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!tripData?.tripId) return;

    subscribeTo(tripData.tripId);

    const unsubscribe = onLocationUpdate((update) => {
      setCurrentLocation({
        latitude: update.latitude,
        longitude: update.longitude,
      });
    });

    return () => {
      unsubscribeFrom(tripData.tripId);
      unsubscribe();
    };
  }, [tripData?.tripId, subscribeTo, unsubscribeFrom, onLocationUpdate]);

  // Share functionality
  const handleShare = async () => {
    if (!tripData) return;

    try {
      await Share.share({
        message: `Track bus ${tripData.busNumber} from ${tripData.origin} to ${tripData.destination}`,
        url: `${process.env.FRONTEND_URL || "http://localhost:8081"}/share/${shareId}`,
        title: `Bus ${tripData.busNumber} Tracking`,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 12, fontSize: 16, color: "#666" }}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  if (error || !tripData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#e74c3c", marginBottom: 12 }}>
          {error || "Trip not found"}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
          This shared link may have expired or is no longer available.
        </Text>
      </View>
    );
  }

  const stops = tripData.stops || [];
  const origin = {
    latitude: 0, // TODO: Get from trip data
    longitude: 0,
    name: tripData.origin,
  };
  const destination = {
    latitude: 0, // TODO: Get from trip data
    longitude: 0,
    name: tripData.destination,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#fff", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>
          Bus {tripData.busNumber}
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          {tripData.origin} → {tripData.destination}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: tripData.status === "in_progress" ? "#2ecc71" : "#95a5a6",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            {tripData.status === "in_progress" ? "🚌 In Transit" : tripData.status}
          </Text>
        </View>

        {tripData.delayMinutes ? (
          <View style={{ marginTop: 8, backgroundColor: "#ffe5e5", padding: 8, borderRadius: 6 }}>
            <Text style={{ color: "#c0392b", fontSize: 14, fontWeight: "500" }}>
              ⏱️ Delayed by {tripData.delayMinutes} minutes
            </Text>
          </View>
        ) : null}
      </View>

      {/* Map */}
      <View style={{ height: 300, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: "hidden" }}>
        <BusMap
          tripId={tripData.tripId}
          origin={origin}
          destination={destination}
          currentLocation={currentLocation}
          stops={stops.map((s) => ({
            latitude: 0, // TODO: Get from stop data
            longitude: 0,
            name: s.city,
          }))}
        />
      </View>

      {/* Trip Details */}
      <View style={{ backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Trip Details</Text>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Departure</Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>
            {new Date(tripData.departureTime).toLocaleTimeString()}
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Estimated Arrival</Text>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>
            {new Date(tripData.estimatedArrivalTime).toLocaleTimeString()}
          </Text>
        </View>

        {tripData.currentSpeed ? (
          <View>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Current Speed</Text>
            <Text style={{ fontSize: 14, fontWeight: "500" }}>{tripData.currentSpeed} km/h</Text>
          </View>
        ) : null}
      </View>

      {/* Stops */}
      {stops.length > 0 && (
        <View style={{ backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Stops</Text>
          {stops.map((stop, index) => (
            <View key={index} style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: index < stops.length - 1 ? 1 : 0, borderBottomColor: "#eee" }}>
              <Text style={{ fontSize: 14, fontWeight: "500" }}>{stop.city}</Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {new Date(stop.estimatedTime).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Share Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
        <Pressable
          onPress={handleShare}
          style={{
            backgroundColor: "#4285F4",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            📤 Share This Trip
          </Text>
        </Pressable>
      </View>

      {/* Disclaimer */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 12, color: "#999", textAlign: "center" }}>
          This is a public shared link. No login required to view trip details.
        </Text>
      </View>
    </ScrollView>
  );
}

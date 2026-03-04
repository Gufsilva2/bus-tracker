import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { BusLocationUpdate, BusStatusUpdate, BusAlert } from "../server/websocket";

interface UseWebSocketOptions {
  url?: string;
  token?: string;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  subscribeTo: (tripId: number) => void;
  unsubscribeFrom: (tripId: number) => void;
  onLocationUpdate: (callback: (update: BusLocationUpdate) => void) => void;
  onStatusUpdate: (callback: (update: BusStatusUpdate) => void) => void;
  onAlert: (callback: (alert: BusAlert) => void) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    token = "",
    autoConnect = true,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const callbacksRef = useRef<{
    locationUpdate: ((update: BusLocationUpdate) => void)[];
    statusUpdate: ((update: BusStatusUpdate) => void)[];
    alert: ((alert: BusAlert) => void)[];
  }>({
    locationUpdate: [],
    statusUpdate: [],
    alert: [],
  });

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect || !token) return;

    const socket = io(url, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error);
    });

    // Data events
    socket.on("location-update", (update: BusLocationUpdate) => {
      callbacksRef.current.locationUpdate.forEach((cb) => cb(update));
    });

    socket.on("status-update", (update: BusStatusUpdate) => {
      callbacksRef.current.statusUpdate.forEach((cb) => cb(update));
    });

    socket.on("alert", (alert: BusAlert) => {
      callbacksRef.current.alert.forEach((cb) => cb(alert));
    });

    // Keep-alive ping
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    socketRef.current = socket;

    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, [url, token, autoConnect]);

  // Subscribe to trip
  const subscribeTo = useCallback((tripId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("subscribe-trip", tripId);
    }
  }, []);

  // Unsubscribe from trip
  const unsubscribeFrom = useCallback((tripId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("unsubscribe-trip", tripId);
    }
  }, []);

  // Register location update callback
  const onLocationUpdate = useCallback((callback: (update: BusLocationUpdate) => void) => {
    callbacksRef.current.locationUpdate.push(callback);
    return () => {
      callbacksRef.current.locationUpdate = callbacksRef.current.locationUpdate.filter(
        (cb) => cb !== callback
      );
    };
  }, []);

  // Register status update callback
  const onStatusUpdate = useCallback((callback: (update: BusStatusUpdate) => void) => {
    callbacksRef.current.statusUpdate.push(callback);
    return () => {
      callbacksRef.current.statusUpdate = callbacksRef.current.statusUpdate.filter(
        (cb) => cb !== callback
      );
    };
  }, []);

  // Register alert callback
  const onAlert = useCallback((callback: (alert: BusAlert) => void) => {
    callbacksRef.current.alert.push(callback);
    return () => {
      callbacksRef.current.alert = callbacksRef.current.alert.filter((cb) => cb !== callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    subscribeTo,
    unsubscribeFrom,
    onLocationUpdate,
    onStatusUpdate,
    onAlert,
  };
}

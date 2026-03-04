import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import type { TrpcContext } from "./_core/context";

/**
 * WebSocket Server for real-time bus tracking
 * Handles location updates, alerts, and status changes
 */

export interface BusLocationUpdate {
  tripId: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  timestamp: number;
}

export interface BusStatusUpdate {
  tripId: number;
  status: "scheduled" | "in_progress" | "delayed" | "completed" | "cancelled";
  delayMinutes?: number;
  timestamp: number;
}

export interface BusAlert {
  tripId: number;
  type: "delay" | "arrival" | "incident" | "traffic" | "custom";
  title: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: number;
}

export class WebSocketServer {
  private io: SocketIOServer;
  private activeConnections: Map<string, Set<number>> = new Map(); // userId -> Set of tripIds
  private tripSubscribers: Map<number, Set<string>> = new Map(); // tripId -> Set of socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      // TODO: Verify token with JWT
      next();
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // Subscribe to trip updates
      socket.on("subscribe-trip", (tripId: number) => {
        console.log(`[WebSocket] Client ${socket.id} subscribed to trip ${tripId}`);
        socket.join(`trip-${tripId}`);

        if (!this.tripSubscribers.has(tripId)) {
          this.tripSubscribers.set(tripId, new Set());
        }
        this.tripSubscribers.get(tripId)!.add(socket.id);
      });

      // Unsubscribe from trip updates
      socket.on("unsubscribe-trip", (tripId: number) => {
        console.log(`[WebSocket] Client ${socket.id} unsubscribed from trip ${tripId}`);
        socket.leave(`trip-${tripId}`);

        const subscribers = this.tripSubscribers.get(tripId);
        if (subscribers) {
          subscribers.delete(socket.id);
          if (subscribers.size === 0) {
            this.tripSubscribers.delete(tripId);
          }
        }
      });

      // Disconnect handler
      socket.on("disconnect", () => {
        console.log(`[WebSocket] Client disconnected: ${socket.id}`);
        this.activeConnections.delete(socket.id);
      });

      // Ping/Pong for keep-alive
      socket.on("ping", () => {
        socket.emit("pong");
      });
    });
  }

  /**
   * Broadcast location update to all subscribers of a trip
   */
  public broadcastLocationUpdate(update: BusLocationUpdate) {
    this.io.to(`trip-${update.tripId}`).emit("location-update", update);
    console.log(`[WebSocket] Broadcast location update for trip ${update.tripId}`);
  }

  /**
   * Broadcast status update to all subscribers of a trip
   */
  public broadcastStatusUpdate(update: BusStatusUpdate) {
    this.io.to(`trip-${update.tripId}`).emit("status-update", update);
    console.log(`[WebSocket] Broadcast status update for trip ${update.tripId}`);
  }

  /**
   * Broadcast alert to all subscribers of a trip
   */
  public broadcastAlert(alert: BusAlert) {
    this.io.to(`trip-${alert.tripId}`).emit("alert", alert);
    console.log(`[WebSocket] Broadcast alert for trip ${alert.tripId}`);
  }

  /**
   * Get number of active subscribers for a trip
   */
  public getSubscriberCount(tripId: number): number {
    return this.tripSubscribers.get(tripId)?.size ?? 0;
  }

  /**
   * Get total active connections
   */
  public getActiveConnections(): number {
    return this.io.engine.clientsCount;
  }

  /**
   * Get IO instance for direct access
   */
  public getIO(): SocketIOServer {
    return this.io;
  }

  /**
   * Shutdown WebSocket server
   */
  public shutdown() {
    this.io.close();
    console.log("[WebSocket] Server shutdown");
  }
}

// Global instance
let wsServer: WebSocketServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer): WebSocketServer {
  if (!wsServer) {
    wsServer = new WebSocketServer(httpServer);
  }
  return wsServer;
}

export function getWebSocketServer(): WebSocketServer | null {
  return wsServer;
}

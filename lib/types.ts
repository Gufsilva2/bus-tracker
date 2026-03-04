/**
 * Tipos TypeScript para BusTracker MVP
 */

// Viagem
export interface Trip {
  id: string;
  origin: string;
  destination: string;
  busCompany: string;
  tripNumber: string;
  departureTime: string; // ISO 8601
  estimatedArrivalTime: string; // ISO 8601
  actualArrivalTime?: string; // ISO 8601
  status: "scheduled" | "in_progress" | "arrived" | "delayed" | "cancelled";
  passengers: string[]; // IDs de passageiros
  createdAt: string;
  updatedAt: string;
}

// Rastreamento em tempo real
export interface TrackingData {
  tripId: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  heading: number; // 0-360 graus
  accuracy: number; // metros
  timestamp: string; // ISO 8601
  distanceRemaining: number; // km
  estimatedArrivalTime: string; // ISO 8601
  currentStatus: "on_schedule" | "delayed" | "ahead_of_schedule";
}

// Alerta
export interface Alert {
  id: string;
  tripId: string;
  type: "proximity" | "delay" | "arrival" | "custom";
  title: string;
  message: string;
  severity: "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

// Compartilhamento público
export interface SharedTrip {
  id: string;
  tripId: string;
  shareCode: string; // Código único para acesso público
  qrCode: string; // URL do QR Code
  publicUrl: string; // URL pública para rastreamento
  createdBy: string; // ID do passageiro que compartilhou
  createdAt: string;
  expiresAt: string; // ISO 8601
  accessCount: number;
}

// Empresa de ônibus
export interface BusCompany {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  logo?: string;
  subscription: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

// Plano de assinatura
export interface SubscriptionPlan {
  id: string;
  companyId: string;
  planType: "starter" | "professional" | "enterprise";
  monthlyPrice: number;
  status: "active" | "inactive" | "cancelled";
  tripsPerMonth: number;
  usedTripsThisMonth: number;
  startDate: string; // ISO 8601
  renewalDate: string; // ISO 8601
  paymentMethod: "credit_card" | "bank_transfer" | "pix";
  lastPaymentDate?: string; // ISO 8601
}

// Passageiro
export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone?: string;
  trips: string[]; // IDs de viagens
  createdAt: string;
  updatedAt: string;
}

// Localização
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Estatísticas de viagem
export interface TripStats {
  tripId: string;
  totalDistance: number; // km
  totalDuration: number; // minutos
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  delayMinutes: number;
  passengersCount: number;
  sharesCount: number;
  alertsTriggered: number;
}

// Resposta de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Contexto de usuário
export interface UserContext {
  userId: string;
  name: string;
  email: string;
  userType: "passenger" | "company" | "admin";
  trips: Trip[];
  preferences: UserPreferences;
}

// Preferências do usuário
export interface UserPreferences {
  notifications: {
    proximity: boolean;
    delay: boolean;
    arrival: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: "pt-BR" | "en-US";
  defaultCompany?: string;
}

// Evento de rastreamento
export interface TrackingEvent {
  id: string;
  tripId: string;
  eventType: "started" | "updated" | "delayed" | "arrived" | "cancelled";
  data: any;
  timestamp: string;
}

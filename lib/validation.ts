import { z } from "zod";

/**
 * Validation schemas for BusTracker
 * Used for form validation and API input validation
 */

// Trip validation
export const tripSchema = z.object({
  busNumber: z
    .string()
    .min(1, "Número do ônibus é obrigatório")
    .regex(/^\d{4}$/, "Número do ônibus deve ter 4 dígitos"),
  origin: z.string().min(3, "Origem deve ter pelo menos 3 caracteres"),
  destination: z.string().min(3, "Destino deve ter pelo menos 3 caracteres"),
  departureTime: z.date(),
  estimatedArrivalTime: z.date(),
  companyId: z.number().positive("Empresa é obrigatória"),
  totalPassengers: z.number().nonnegative().default(0),
});

export type TripInput = z.infer<typeof tripSchema>;

// Company validation
export const companySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido")
    .optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, "Digite algo para buscar"),
  type: z.enum(["city", "busNumber", "all"]).default("all"),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Location validation
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().nonnegative().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;

// Alert validation
export const alertSchema = z.object({
  tripId: z.number().positive(),
  type: z.enum(["delay", "arrival", "incident", "traffic", "custom"]),
  title: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(["info", "warning", "error"]).default("info"),
});

export type AlertInput = z.infer<typeof alertSchema>;

// Preferences validation
export const preferencesSchema = z.object({
  notificationsEnabled: z.boolean().default(true),
  notifyOnDelay: z.boolean().default(true),
  notifyOnArrival: z.boolean().default(true),
  notifyOnProximity: z.boolean().default(true),
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
  language: z.enum(["pt-BR", "en-US"]).default("pt-BR"),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

/**
 * Validation helper functions
 */

export function validateTrip(data: unknown): TripInput {
  return tripSchema.parse(data);
}

export function validateCompany(data: unknown): CompanyInput {
  return companySchema.parse(data);
}

export function validateSearch(data: unknown): SearchInput {
  return searchSchema.parse(data);
}

export function validateLocation(data: unknown): LocationInput {
  return locationSchema.parse(data);
}

export function validateAlert(data: unknown): AlertInput {
  return alertSchema.parse(data);
}

export function validatePreferences(data: unknown): PreferencesInput {
  return preferencesSchema.parse(data);
}

/**
 * Safe validation functions that return errors instead of throwing
 */

export function safeTripValidation(data: unknown): { data?: TripInput; error?: string } {
  try {
    return { data: validateTrip(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || "Validação falhou" };
    }
    return { error: "Erro desconhecido" };
  }
}

export function safeCompanyValidation(data: unknown): { data?: CompanyInput; error?: string } {
  try {
    return { data: validateCompany(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || "Validação falhou" };
    }
    return { error: "Erro desconhecido" };
  }
}

export function safeSearchValidation(data: unknown): { data?: SearchInput; error?: string } {
  try {
    return { data: validateSearch(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || "Validação falhou" };
    }
    return { error: "Erro desconhecido" };
  }
}

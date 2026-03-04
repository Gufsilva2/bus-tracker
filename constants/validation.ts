/**
 * Validation constants and rules for BusTracker
 */

// Bus number format
export const BUS_NUMBER_REGEX = /^\d{4}$/;
export const BUS_NUMBER_PATTERN = "0000";

// CNPJ format
export const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
export const CNPJ_PATTERN = "00.000.000/0000-00";

// Phone format
export const PHONE_REGEX = /^\(\d{2}\) \d{4,5}-\d{4}$/;
export const PHONE_PATTERN = "(00) 00000-0000";

// Email format
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Location bounds
export const MIN_LATITUDE = -90;
export const MAX_LATITUDE = 90;
export const MIN_LONGITUDE = -180;
export const MAX_LONGITUDE = 180;

// Speed limits
export const MIN_SPEED = 0;
export const MAX_SPEED = 200; // km/h

// Time limits
export const MIN_TRIP_DURATION = 15; // minutes
export const MAX_TRIP_DURATION = 48 * 60; // 48 hours

// Passenger limits
export const MIN_PASSENGERS = 0;
export const MAX_PASSENGERS = 100;

// Delay thresholds
export const DELAY_THRESHOLD_WARNING = 30; // minutes
export const DELAY_THRESHOLD_ERROR = 60; // minutes

// String length limits
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 255;

export const MIN_CITY_LENGTH = 3;
export const MAX_CITY_LENGTH = 255;

export const MIN_MESSAGE_LENGTH = 1;
export const MAX_MESSAGE_LENGTH = 500;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "Este campo é obrigatório",
  INVALID_FORMAT: "Formato inválido",
  TOO_SHORT: "Muito curto",
  TOO_LONG: "Muito longo",
  INVALID_EMAIL: "Email inválido",
  INVALID_PHONE: "Telefone inválido",
  INVALID_CNPJ: "CNPJ inválido",
  INVALID_BUS_NUMBER: "Número do ônibus deve ter 4 dígitos",
  INVALID_LOCATION: "Localização inválida",
  INVALID_DATE: "Data inválida",
  INVALID_TIME: "Hora inválida",
  PAST_DATE: "Data não pode ser no passado",
  INVALID_RANGE: "Intervalo inválido",
  DUPLICATE: "Este valor já existe",
  NOT_FOUND: "Não encontrado",
  UNAUTHORIZED: "Não autorizado",
  FORBIDDEN: "Acesso negado",
  SERVER_ERROR: "Erro no servidor",
  NETWORK_ERROR: "Erro de conexão",
};

// Status options
export const TRIP_STATUS_OPTIONS = [
  { value: "scheduled", label: "Agendada", color: "#3B82F6" },
  { value: "in_progress", label: "Em andamento", color: "#10B981" },
  { value: "arrived", label: "Chegada", color: "#8B5CF6" },
  { value: "delayed", label: "Atrasada", color: "#F59E0B" },
  { value: "cancelled", label: "Cancelada", color: "#EF4444" },
];

export const ALERT_SEVERITY_OPTIONS = [
  { value: "info", label: "Informação", color: "#3B82F6" },
  { value: "warning", label: "Aviso", color: "#F59E0B" },
  { value: "error", label: "Erro", color: "#EF4444" },
];

export const ALERT_TYPE_OPTIONS = [
  { value: "delay", label: "Atraso" },
  { value: "arrival", label: "Chegada" },
  { value: "incident", label: "Incidente" },
  { value: "traffic", label: "Tráfego" },
  { value: "custom", label: "Customizado" },
];

export const TRAFFIC_INCIDENT_TYPES = [
  { value: "accident", label: "Acidente" },
  { value: "congestion", label: "Congestionamento" },
  { value: "roadwork", label: "Obras" },
  { value: "weather", label: "Clima" },
  { value: "incident", label: "Incidente" },
];

export const SUBSCRIPTION_PLANS = [
  { value: "starter", label: "Iniciante", trips: 100 },
  { value: "professional", label: "Profissional", trips: 500 },
  { value: "enterprise", label: "Enterprise", trips: 5000 },
];

// Theme options
export const THEME_OPTIONS = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "auto", label: "Automático" },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
];

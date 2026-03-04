/**
 * Notification Service
 * Handles local and push notifications for travel updates
 */

export interface Notification {
  id: string;
  type: "delay" | "reminder" | "arrival" | "alert";
  title: string;
  message: string;
  travelId: string;
  timestamp: string;
  read: boolean;
}

export class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notification: Notification) => void)[] = [];

  /**
   * Create and send a notification
   */
  sendNotification(
    type: Notification["type"],
    title: string,
    message: string,
    travelId: string
  ): Notification {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      travelId,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.push(notification);
    this.notifyListeners(notification);

    return notification;
  }

  /**
   * Send delay notification
   */
  notifyDelay(travelId: string, delayMinutes: number): Notification {
    return this.sendNotification(
      "delay",
      "Atraso na Viagem",
      `Sua viagem está atrasada em ${delayMinutes} minutos.`,
      travelId
    );
  }

  /**
   * Send reminder notification (1 hour before arrival)
   */
  notifyReminder(travelId: string, destination: string): Notification {
    return this.sendNotification(
      "reminder",
      "Falta 1 Hora",
      `Você chegará em ${destination} em aproximadamente 1 hora.`,
      travelId
    );
  }

  /**
   * Send arrival notification
   */
  notifyArrival(travelId: string, destination: string): Notification {
    return this.sendNotification(
      "arrival",
      "Chegada",
      `Você chegou em ${destination}. Bem-vindo!`,
      travelId
    );
  }

  /**
   * Send traffic alert notification
   */
  notifyTrafficAlert(
    travelId: string,
    location: string,
    additionalDelay: number
  ): Notification {
    return this.sendNotification(
      "alert",
      "Alerta de Tráfego",
      `Congestionamento em ${location}. Atraso adicional de ~${additionalDelay} min.`,
      travelId
    );
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
  }

  /**
   * Subscribe to notifications
   */
  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(notification: Notification): void {
    this.listeners.forEach((listener) => listener(notification));
  }

  /**
   * Check if delay notification should be sent
   */
  shouldNotifyDelay(delayMinutes: number): boolean {
    return delayMinutes > 30;
  }

  /**
   * Check if reminder notification should be sent
   */
  shouldNotifyReminder(timeRemainingMinutes: number): boolean {
    return timeRemainingMinutes <= 60 && timeRemainingMinutes > 55;
  }

  /**
   * Check if arrival notification should be sent
   */
  shouldNotifyArrival(timeRemainingMinutes: number): boolean {
    return timeRemainingMinutes <= 5 && timeRemainingMinutes >= 0;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

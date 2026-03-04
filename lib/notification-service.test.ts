import { describe, it, expect, beforeEach } from "vitest";
import { NotificationService } from "./notification-service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  describe("sendNotification", () => {
    it("should create and send a notification", () => {
      const notification = service.sendNotification(
        "delay",
        "Test Title",
        "Test Message",
        "travel-1"
      );

      expect(notification.id).toBeDefined();
      expect(notification.type).toBe("delay");
      expect(notification.title).toBe("Test Title");
      expect(notification.message).toBe("Test Message");
      expect(notification.travelId).toBe("travel-1");
      expect(notification.read).toBe(false);
    });

    it("should add notification to list", () => {
      service.sendNotification("delay", "Title", "Message", "travel-1");
      const notifications = service.getNotifications();

      expect(notifications.length).toBe(1);
    });
  });

  describe("notifyDelay", () => {
    it("should send delay notification", () => {
      const notification = service.notifyDelay("travel-1", 45);

      expect(notification.type).toBe("delay");
      expect(notification.title).toBe("Atraso na Viagem");
      expect(notification.message).toContain("45");
    });
  });

  describe("notifyReminder", () => {
    it("should send reminder notification", () => {
      const notification = service.notifyReminder("travel-1", "São Paulo");

      expect(notification.type).toBe("reminder");
      expect(notification.title).toBe("Falta 1 Hora");
      expect(notification.message).toContain("São Paulo");
    });
  });

  describe("notifyArrival", () => {
    it("should send arrival notification", () => {
      const notification = service.notifyArrival("travel-1", "São Paulo");

      expect(notification.type).toBe("arrival");
      expect(notification.title).toBe("Chegada");
      expect(notification.message).toContain("São Paulo");
    });
  });

  describe("notifyTrafficAlert", () => {
    it("should send traffic alert notification", () => {
      const notification = service.notifyTrafficAlert(
        "travel-1",
        "BR-116 km 500",
        30
      );

      expect(notification.type).toBe("alert");
      expect(notification.title).toBe("Alerta de Tráfego");
      expect(notification.message).toContain("BR-116 km 500");
      expect(notification.message).toContain("30");
    });
  });

  describe("getNotifications", () => {
    it("should return all notifications", () => {
      service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      service.sendNotification("reminder", "Title 2", "Message 2", "travel-2");

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(2);
    });

    it("should return a copy of notifications", () => {
      service.sendNotification("delay", "Title", "Message", "travel-1");
      const notifications1 = service.getNotifications();
      const notifications2 = service.getNotifications();

      expect(notifications1).not.toBe(notifications2);
      expect(notifications1).toEqual(notifications2);
    });
  });

  describe("getUnreadNotifications", () => {
    it("should return only unread notifications", () => {
      const notif1 = service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      const notif2 = service.sendNotification("reminder", "Title 2", "Message 2", "travel-2");

      service.markAsRead(notif1.id);

      const unread = service.getUnreadNotifications();
      expect(unread.length).toBe(1);
      expect(unread[0].id).toBe(notif2.id);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", () => {
      const notification = service.sendNotification("delay", "Title", "Message", "travel-1");
      service.markAsRead(notification.id);

      const notifications = service.getNotifications();
      expect(notifications[0].read).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", () => {
      service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      service.sendNotification("reminder", "Title 2", "Message 2", "travel-2");

      service.markAllAsRead();

      const notifications = service.getNotifications();
      expect(notifications.every((n) => n.read)).toBe(true);
    });
  });

  describe("deleteNotification", () => {
    it("should delete a notification", () => {
      const notif1 = service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      service.sendNotification("reminder", "Title 2", "Message 2", "travel-2");

      const beforeDelete = service.getNotifications();
      expect(beforeDelete.length).toBeGreaterThanOrEqual(2);
      
      service.deleteNotification(notif1.id);

      const notifications = service.getNotifications();
      expect(notifications.length).toBeLessThan(beforeDelete.length);
    });
  });

  describe("clearAll", () => {
    it("should clear all notifications", () => {
      service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      service.sendNotification("reminder", "Title 2", "Message 2", "travel-2");

      service.clearAll();

      const notifications = service.getNotifications();
      expect(notifications.length).toBe(0);
    });
  });

  describe("subscribe", () => {
    it("should subscribe to notifications", () => {
      let receivedNotification: any = null;
      const unsubscribe = service.subscribe((notification) => {
        receivedNotification = notification;
      });

      service.sendNotification("delay", "Title", "Message", "travel-1");

      expect(receivedNotification).not.toBeNull();
      expect(receivedNotification?.type).toBe("delay");

      unsubscribe();
    });

    it("should unsubscribe from notifications", () => {
      let callCount = 0;
      const unsubscribe = service.subscribe(() => {
        callCount++;
      });

      service.sendNotification("delay", "Title 1", "Message 1", "travel-1");
      expect(callCount).toBe(1);

      unsubscribe();
      service.sendNotification("delay", "Title 2", "Message 2", "travel-2");
      expect(callCount).toBe(1);
    });
  });

  describe("shouldNotifyDelay", () => {
    it("should return true for delays > 30 minutes", () => {
      expect(service.shouldNotifyDelay(45)).toBe(true);
      expect(service.shouldNotifyDelay(60)).toBe(true);
    });

    it("should return false for delays <= 30 minutes", () => {
      expect(service.shouldNotifyDelay(30)).toBe(false);
      expect(service.shouldNotifyDelay(15)).toBe(false);
    });
  });

  describe("shouldNotifyReminder", () => {
    it("should return true when time remaining is 55-60 minutes", () => {
      expect(service.shouldNotifyReminder(60)).toBe(true);
      expect(service.shouldNotifyReminder(57)).toBe(true);
      expect(service.shouldNotifyReminder(55)).toBe(false);
    });

    it("should return false for other times", () => {
      expect(service.shouldNotifyReminder(120)).toBe(false);
      expect(service.shouldNotifyReminder(30)).toBe(false);
    });
  });

  describe("shouldNotifyArrival", () => {
    it("should return true when time remaining is 0-5 minutes", () => {
      expect(service.shouldNotifyArrival(5)).toBe(true);
      expect(service.shouldNotifyArrival(2)).toBe(true);
      expect(service.shouldNotifyArrival(0)).toBe(true);
    });

    it("should return false for other times", () => {
      expect(service.shouldNotifyArrival(10)).toBe(false);
      expect(service.shouldNotifyArrival(60)).toBe(false);
    });
  });
});

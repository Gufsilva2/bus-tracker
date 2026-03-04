import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

/**
 * Push Notifications Service
 * Handles setup, scheduling, and management of push notifications
 */

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request push notification permissions
 */
export async function requestPushNotificationPermissions(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // Get push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (error) {
    console.error("Error requesting push notification permissions:", error);
    return null;
  }
}

/**
 * Send local notification
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: "default",
        badge: 1,
      },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error("Error sending local notification:", error);
  }
}

/**
 * Schedule notification for specific time
 */
export async function scheduleNotification(
  title: string,
  body: string,
  triggerDate: Date,
  data?: Record<string, any>
) {
  try {
    const secondsUntilTrigger = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

    if (secondsUntilTrigger < 0) {
      console.warn("Trigger date is in the past");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: "default",
        badge: 1,
      },
      trigger: { seconds: secondsUntilTrigger },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
}

/**
 * Setup trip alerts
 */
export async function setupTripAlerts(tripData: {
  id: number;
  busNumber: string;
  destination: string;
  departureTime: Date;
  estimatedArrivalTime: Date;
}) {
  try {
    // Alert 1 hour before arrival
    const oneHourBefore = new Date(tripData.estimatedArrivalTime);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);

    await scheduleNotification(
      "Falta 1 hora para chegada",
      `Bus ${tripData.busNumber} - ${tripData.destination}`,
      oneHourBefore,
      { tripId: tripData.id, type: "arrival_reminder" }
    );

    // Alert 30 minutes before arrival
    const thirtyMinBefore = new Date(tripData.estimatedArrivalTime);
    thirtyMinBefore.setMinutes(thirtyMinBefore.getMinutes() - 30);

    await scheduleNotification(
      "Falta 30 minutos para chegada",
      `Bus ${tripData.busNumber} - ${tripData.destination}`,
      thirtyMinBefore,
      { tripId: tripData.id, type: "arrival_reminder_30min" }
    );

    // Alert at departure
    await scheduleNotification(
      "Sua viagem está saindo",
      `Bus ${tripData.busNumber} - ${tripData.destination}`,
      tripData.departureTime,
      { tripId: tripData.id, type: "departure" }
    );
  } catch (error) {
    console.error("Error setting up trip alerts:", error);
  }
}

/**
 * Send delay alert
 */
export async function sendDelayAlert(
  busNumber: string,
  delayMinutes: number,
  destination: string
) {
  const severity = delayMinutes > 60 ? "high" : delayMinutes > 30 ? "medium" : "low";
  const emoji = severity === "high" ? "🔴" : severity === "medium" ? "🟡" : "🟢";

  await sendLocalNotification(
    `${emoji} Viagem atrasada`,
    `Bus ${busNumber} para ${destination} está ${delayMinutes} minutos atrasado`,
    { type: "delay", delayMinutes, severity }
  );
}

/**
 * Send arrival alert
 */
export async function sendArrivalAlert(busNumber: string, destination: string) {
  await sendLocalNotification(
    "✅ Você chegou!",
    `Bus ${busNumber} chegou em ${destination}`,
    { type: "arrival" }
  );
}

/**
 * Send traffic alert
 */
export async function sendTrafficAlert(
  road: string,
  description: string,
  severity: "low" | "medium" | "high"
) {
  const emoji = severity === "high" ? "🚨" : severity === "medium" ? "⚠️" : "ℹ️";

  await sendLocalNotification(
    `${emoji} Alerta de tráfego - ${road}`,
    description,
    { type: "traffic", severity }
  );
}

/**
 * Listen to notification responses
 */
export function setupNotificationListeners(
  onNotificationResponse: (notification: Notifications.Notification) => void
) {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    onNotificationResponse(response.notification);
  });

  return subscription;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling notifications:", error);
  }
}

/**
 * Cancel specific notification
 */
export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
}

import fetch from "node-fetch";
import { Service } from "./index.service";

interface OneSignalService extends Service {
  sendNotification: (
    userId: number | string,
    notif: { title: string; body: string }
  ) => Promise<any>;
}

let locked = true;

const oneSignalService: OneSignalService = {
  init: async () => {
    locked = false;
    console.log("[ONESIGNAL] OneSignal service initialized");
  },
  sendNotification: async (
    userId: number | string,
    notif: { title: string; body: string }
  ) => {
    try {
      if (locked)
        throw new Error("[ONESIGNAL] OneSginal service not initialized yet");
      const response = await fetch(
        `https://onesignal.com/api/v1/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
          },
          body: JSON.stringify({
            app_id: process.env.ONESIGNAL_APP_ID,
            contents: { en: notif.body },
            headings: { en: notif.title },
            include_external_user_ids: [userId.toString()]
          })
        }
      );

      const responseJSON = await response.json();

      if (response.status != 200) throw new Error(responseJSON);

      console.log(`[ONESIGNAL] Notification successfully sended`);
      console.log(
        `[ONESIGNAL] Sended message data: ${JSON.stringify(responseJSON)}`
      );
      return responseJSON;
    } catch (error) {
      console.log(`[ONESIGNAL] Error sending notification`);
      throw error;
    }
  }
};

export { oneSignalService };

import firebase from "firebase-admin";
import { Service } from "./index.service";

interface FirebaseService extends Service {
  sendToTopic: (title, body, topic) => Promise<void>;
}

let locked = true;

const firebaseService: FirebaseService = {
  init: async () => {
    try {
      const serviceAccount = require(process.env
        .GOOGLE_APPLICATION_CREDENTIALS);

      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });

      locked = false;
      console.log("[FIREBASE] Firebase service initialized");
    } catch (error) {
      console.log("[FIREBASE] Error during Firebase service initialization");
      throw error;
    }
  },
  sendToTopic: async (title, body, topic) => {
    try {
      if (locked)
        throw new Error("[FIREBASE] Firebase service not initialized yet");
      const response = await firebase
        .messaging()
        .sendToTopic(`/topics/${topic}`, {
          notification: {
            title,
            body,
            content_available: "true"
          },
          data: {
            title,
            body,
            content_available: "true"
          }
        });

      console.log(`[FIREBASE] Notification successfully sended`);
      console.log(
        `[FIREBASE] Sended message data: ${JSON.stringify(response)}`
      );
    } catch (error) {
      console.log("[FIREBASE] Error sending notification");
      throw error;
    }
  }
};

export { firebaseService };

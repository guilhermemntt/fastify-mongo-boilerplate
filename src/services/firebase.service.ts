import firebase from "firebase-admin";
import { Service } from "./index.service";

interface FirebaseService extends Service {
  sendToTopic: (title, body, topic) => Promise<void>;
}

const firebaseService: FirebaseService = {
  init: async () => {
    try {
      const serviceAccount = require(process.env.FIREBASE_CONFIG_FILE_LOCATION)[
        "credential-certificate-filename"
      ];

      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });

      console.log("Firebase service initialized.");
    } catch (error) {
      throw error;
    }
  },
  sendToTopic: async (title, body, topic) => {
    try {
      await firebase.messaging().sendToTopic(`/topics/${topic}`, {
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

export { firebaseService };

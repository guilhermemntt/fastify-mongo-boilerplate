import { MongoClient, Db } from "mongodb";
import { Service } from "./index.service";
import { Collections, getTypesCollections } from "../types/index.type";

interface MongoService extends Service {
  getCollections: () => Collections;
}

let collections: Collections;

const mongoService: MongoService = {
  init: async () => {
    try {
      const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
      MongoClient.connect(url, (error, client) => {
        if (error) throw error;
        const mongoClient = client.db(process.env.MONGO_NAME);
        collections = getTypesCollections(mongoClient);
      });
      console.log("[MONGODB] MongoDB service initialized");
    } catch (error) {
      console.log("[MONGODB] Error during MongoDB service initialization");
      throw error;
    }
  },
  getCollections: () => {
    try {
      if (!collections)
        throw new Error("[MONGODB] MongoDB service not initialized yet");
      return collections;
    } catch (error) {
      console.log(`[MONGODB] Error returning MongoDB collections`);
      throw error;
    }
  }
};

export { mongoService };

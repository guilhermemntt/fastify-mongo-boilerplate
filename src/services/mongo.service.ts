import { MongoClient, Db } from "mongodb";
import { Service } from "./index.service";
import { User, Collections, Address } from "../types/index.type";

interface MongoService extends Service {
  getCollections: () => Collections;
}

let collections: Collections;

const mongoService: MongoService = {
  init: async () => {
    try {
      const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
      MongoClient.connect(url, (error, client) => {
        if (error)
          throw new Error("MongoDB service initialized with error: " + error);
        const mongoClient = client.db(process.env.MONGO_NAME);

        collections = {
          users: mongoClient.collection<User>("users"),
          addresses: mongoClient.collection<Address>("addresses")
        };
      });
      console.log("Mongo DB service initialized");
    } catch (error) {
      throw error;
    }
  },
  getCollections: () => {
    try {
      if (!collections) throw new Error("MongoDB service not initialized");
      return collections;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

export { mongoService };

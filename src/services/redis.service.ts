import redis, { RedisClient } from "redis";
import { Service } from "./index.service";

interface RedisService extends Service {
  get: (key: string) => Promise<string>;
  set: (key: string, value: string) => Promise<string>;
}

let client: RedisClient;

const redisService: RedisService = {
  init: async () => {
    try {
      client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      });
      console.log("[REDIS] Redis service initialized");
    } catch (error) {
      console.log("[REDIS] Error during Redis service initialization");
      throw error;
    }
  },
  get: async (key: string): Promise<string> => {
    try {
      if (!client) throw new Error("[REDIS] Redis service not initialized yet");
      return new Promise((resolve, reject) => {
        client.get(key, (error, reply) => {
          if (error) reject(error);
          resolve(reply);
          console.log("[REDIS] Getting data");
        });
      });
    } catch (error) {
      console.log("[REDIS] Error getting data");
      throw error;
    }
  },
  set: async (key: string, value: string): Promise<string> => {
    try {
      if (!client) throw new Error("[REDIS] Redis service not initialized yet");
      return new Promise((resolve, reject) => {
        client.set(key, value, "EX", 3600, (error, reply) => {
          if (error) reject(error);
          console.log("[REDIS] Setting data");
          resolve(reply);
        });
      });
    } catch (error) {
      console.log("[REDIS] Error setting data");
      throw error;
    }
  }
};
export { redisService };

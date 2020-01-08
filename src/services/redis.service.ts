import redis, { RedisClient } from "redis";
import { Service } from "./index.service";

interface RedisService extends Service {
  get: (key: string) => Promise<string>;
  set: (key: string, value: string) => Promise<string>;
}

let client: RedisClient;

const redisService: RedisService = {
  init: () => {
    try {
      client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      });
      console.log("Redis service initialized");
    } catch (error) {
      throw error;
    }
  },
  get: async (key: string): Promise<string> => {
    try {
      return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  set: async (key: string, value: string): Promise<string> => {
    try {
      return new Promise((resolve, reject) => {
        client.set(key, value, "EX", 3600, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
export { redisService };

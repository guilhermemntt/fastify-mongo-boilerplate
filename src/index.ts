import dotenv from "dotenv";
import { fastifyService } from "./services/fastify.service";
import { Service } from "./services/index.service";
import { mongoService } from "./services/mongo.service";
import { oneSignalService } from "./services/onesignal.service";
import { firebaseService } from "./services/firebase.service";
import { emailerService } from "./services/emailer.service";
import { redisService } from "./services/redis.service";
import { awsService } from "./services/aws.service";

dotenv.config({ path: "../.env" });

const services: Service[] = [mongoService, fastifyService];

(async () => {
  try {
    for (const service of services) {
      await service.init();
    }
    console.log("Server initialized.");
    //PUT ADITIONAL CODE HERE.
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

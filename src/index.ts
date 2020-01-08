import dotenv from "dotenv";
import { fastifyService } from "./services/fastify.service";
import { Service } from "./services/index.service";
import { mongoService } from "./services/mongo.service";
import { userController } from "./controllers/user.controller";

dotenv.config({ path: "../.env" });

const services: Service[] = [mongoService];

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

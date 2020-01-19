import fastify from "fastify";
import fastifyCors from "fastify-cors";
import multer from "fastify-multer";
import fastifyJwt from "fastify-jwt";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "../routes/index.route";
import { AddressInfo } from "net";
import { Service } from "./index.service";

interface FastifyService extends Service {
  jwtSign: (payload: any) => any;
}

let server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

const fastifyService: FastifyService = {
  init: async () => {
    try {
      server = fastify({});

      server.register(fastifyJwt, { secret: process.env.SERVER_JWT_SECRET });
      server.register(multer.contentParser);
      server.register(fastifyCors);

      routes.forEach(route => {
        server.route(route);
      });

      await server.listen(Number(process.env.SERVER_PORT), "0.0.0.0");

      console.log(
        `[FASTIFY] Fastify service initialized on port ${
          (server.server.address() as AddressInfo).port
        }.`
      );
    } catch (error) {
      console.log("[FASTIFY] Error during fastify service initialization");
      throw error;
    }
  },
  jwtSign: payload => {
    try {
      if (!server)
        throw new Error("[FASTIFY] Fastify service not initialized yet");
      console.log("[FASTIFY] Generating fastify JWT sign");
      return server.jwt.sign({ payload });
    } catch (error) {
      console.log("[FASTIFY] Error during fastify JWT sign");
      throw error;
    }
  }
};

export { fastifyService };

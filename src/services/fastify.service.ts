import fastify from "fastify";
import fastifyCors from "fastify-cors";
import multer from "fastify-multer";
import fastifyJwt from "fastify-jwt";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "../routes/index.route";
import { AddressInfo } from "net";
import { Service } from "./index.service";

const fastifyService: Service = {
  init: async () => {
    try {
      const server: fastify.FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse
      > = fastify({});

      server.register(fastifyJwt, { secret: process.env.JWT_SECRET });
      server.register(multer.contentParser);
      server.register(fastifyCors);

      routes.forEach(route => {
        server.route(route);
      });

      await server.listen(Number(process.env.SERVER_PORT), "0.0.0.0");

      console.log(
        `Fastify service initialized on port ${
          (server.server.address() as AddressInfo).port
        }.`
      );
    } catch (error) {
      throw error;
    }
  }
};

export { fastifyService };

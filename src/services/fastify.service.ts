import fastifyJwt from "fastify-jwt";
import fastify from "fastify";
import fastifyCors from "fastify-cors";
import multer from "fastify-multer";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "../routes/index.route";
import { AddressInfo } from "net";
import { Service } from "./index.service";
import moment from "moment";

interface BlacklistedToken {
  jti: string;
  exp: number;
  iat: number;
}

interface FastifyService extends Service {
  jwtSign: (payload: any) => any;
  jwtBlacklistToken: (token: string) => void;
  jwtGetToken: (request: fastify.FastifyRequest) => string;
}

let server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

let blacklist: BlacklistedToken[] = [];
let jwtidCounter: number = 0;

const fastifyService: FastifyService = {
  init: async () => {
    try {
      server = fastify({});

      if (process.env.SERVER_JWT === "true")
        server.register(fastifyJwt, {
          secret: process.env.SERVER_JWT_SECRET,
          trusted: (request, decodedToken) =>
            blacklist.some(
              blacklistedToken => blacklistedToken.jti == decodedToken.jti
            )
              ? false
              : (decodedToken as any).payload
        });
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
  jwtSign: _payload => {
    try {
      if (!server)
        throw new Error("[FASTIFY] Fastify service not initialized yet");
      if (process.env.SERVER_JWT !== "true")
        throw new Error("[FASTIFY] Fastify JWT flag is not setted");

      console.log("[FASTIFY] Generating fastify JWT sign");

      const payload = JSON.parse(JSON.stringify(_payload));

      jwtidCounter = jwtidCounter + 1;
      return server.jwt.sign(
        { payload },
        {
          expiresIn: Number(process.env.SERVER_JWT_TIMEOUT),
          jwtid: jwtidCounter + ""
        }
      );
    } catch (error) {
      console.log("[FASTIFY] Error during fastify JWT sign");
      throw error;
    }
  },
  jwtGetToken: request => {
    try {
      if (!server)
        throw new Error("[FASTIFY] Fastify service not initialized yet");
      if (process.env.SERVER_JWT !== "true")
        throw new Error("[FASTIFY] Fastify JWT flag is not setted");
      if (
        !request.headers.authorization ||
        request.headers.authorization.split(" ")[0] !== "Bearer"
      )
        throw new Error("[FASTIFY] Fastify JWT token not provided");

      return request.headers.authorization.split(" ")[1];
    } catch (error) {
      console.log("[FASTIFY] Error getting JWT token");
      throw error;
    }
  },
  jwtBlacklistToken: token => {
    try {
      if (!server)
        throw new Error("[FASTIFY] Fastify service not initialized yet");
      if (process.env.SERVER_JWT !== "true")
        throw new Error("[FASTIFY] Fastify JWT flag is not setted");
      while (
        blacklist.length &&
        moment().diff("1970-01-01 00:00:00Z", "seconds") > blacklist[0].exp
      ) {
        console.log(
          `[FASTIFY] Removing from blacklist timed out JWT with id ${blacklist[0].jti}`
        );
        blacklist.shift();
      }
      const { jti, exp, iat } = server.jwt.decode(token);
      console.log(`[FASTIFY] Adding JWT ${token} with id ${jti} to blacklist`);
      blacklist.push({ jti, exp, iat });
    } catch (error) {
      console.log("[FASTIFY] Error blacklisting fastify JWT token");
      throw error;
    }
  }
};

export { fastifyService };

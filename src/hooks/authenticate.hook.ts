import fastify from "fastify";

const authenticationHook: fastify.FastifyMiddleware = async (
  request,
  reply
) => {
  try {
    if (process.env.SERVER_JWT === "true") await request.jwtVerify();
  } catch (error) {
    console.log("[FASTIFY] Unauthorized error with JWT validation \n", error);
    reply.code(401).send();
  }
};

export { authenticationHook };

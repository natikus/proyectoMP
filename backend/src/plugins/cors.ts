import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: "*",
  });
  console.log("CORS configurado para:", process.env.ipLocalhost);
});

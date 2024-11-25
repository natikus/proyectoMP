import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: ["https://localhost", "https://192.168.1.22"],
  });
  console.log("registre cors");
});

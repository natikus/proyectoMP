import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: ["https://localhost", "https://10.4.201.163"],
  });
  console.log("registre cors");
});

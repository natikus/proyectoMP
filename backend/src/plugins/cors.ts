import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: ["https://localhost", `https://${process.env.ipLocalhost}`, "*"],
  });
  console.log("registre cors");
});

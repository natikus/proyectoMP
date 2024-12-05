import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: [
      "https://localhost", // Para desarrollo local
      `https://${process.env.ipLocalhost}`, // Tu backend
      `https://${process.env.ipLocalhost}/backend`,
      "https://192.168.1.28/backend/auth/", // Ruta explícita
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  console.log("CORS configurado para:", process.env.ipLocalhost);
});

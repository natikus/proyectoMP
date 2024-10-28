import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { UsuarioLoginSchema } from "../../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../../services/database.js";
import bcrypt from "bcrypt";
import { Type } from "@sinclair/typebox";

const usuarioLoginRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para login
  fastify.post("/", {
    schema: {
      summary: "Registrase",
      body: UsuarioLoginSchema,
      tags: ["auth"],
      description: "Ruta para registrarse",
      response: {
        201: {
          description: "Usuario registrado exitosamente",
          content: {
            "application/json": {
              schema: UsuarioLoginSchema,
            },
          },
        },
        400: {
          description: "Error en la solicitud",
          content: {
            "application/json": {
              schema: Type.Object({
                message: Type.String(),
              }),
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { email, contrasena } = request.body as {
        email: string;
        contrasena: string;
      };
      try {
        const res = await query(
          "SELECT id_persona, contrasena FROM usuarioVirtual WHERE email = $1",
          [email]
        );
        if (res.rows.length === 0) {
          return reply.code(401).send({ message: "Usuario no encontrado" });
        }
        const usuario = res.rows[0];
        const isPasswordValid = await bcrypt.compare(
          contrasena,
          usuario.contrasena
        );
        if (!isPasswordValid) {
          return reply.code(401).send({ message: "Contraseña incorrecta" });
        }
        const token = fastify.jwt.sign(usuario);
        reply.code(200).send({ token, usuario });
      } catch (error) {
        console.error("Error en el login:", error);
        reply.code(500).send({ message: "Error en el servidor" });
      }
    },
  });
};
export default usuarioLoginRoute;

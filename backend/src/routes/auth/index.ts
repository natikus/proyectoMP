import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import {
  UsuarioLoginSchema,
  UsuarioPostSchema,
  UsuarioPostType,
} from "../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from "bcrypt";
import { Type } from "@sinclair/typebox";

const usuarioLoginRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para login
  fastify.post("/login", {
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
          "SELECT id_usuario, contrasena FROM usuarioVirtual WHERE email = $1",
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

        // Generar token JWT
        const token = fastify.jwt.sign(usuario);

        // Responder con el token
        reply.code(200).send({ token, usuario });
      } catch (error) {
        console.error("Error en el login:", error);
        reply.code(500).send({ message: "Error en el servidor" });
      }
    },
  });

  // Ruta para crear un usuario
  // Ruta para crear un usuario
  fastify.post("/", {
    schema: {
      summary: "Crear usuario",
      body: UsuarioPostSchema,
      tags: ["auth"],

      description: "Ruta para crear un nuevo usuario",
      response: {
        201: {
          description: "Usuario creado exitosamente",
          content: {
            "application/json": {
              schema: Type.Object({
                nombre: Type.String(),
                apellido: Type.String(),
                usuario: Type.String(),
                cedula: Type.String(),
                email: Type.String(),
                telefono: Type.String(),
                foto: Type.String(),
                descripcion: Type.String(),
                intereses: Type.Array(Type.String()),
              }),
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
    handler: async function (request, reply) {
      const UsuarioPost = request.body as UsuarioPostType;
      const hashedPassword = await bcrypt.hash(UsuarioPost.contrasena, 10);
      console.log(request.body);
      try {
        const res = await query(
          `
                    INSERT INTO usuarios
                    (nombre, apellido, usuario, cedula, email, telefono, foto, is_Admin, descripcion, fechaCreacion, intereses, contrasena)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10, $11)
                    RETURNING id;
                `,
          [
            UsuarioPost.nombre,
            UsuarioPost.apellido,
            UsuarioPost.usuario,
            UsuarioPost.cedula,
            UsuarioPost.email,
            UsuarioPost.telefono,
            UsuarioPost.foto,
            UsuarioPost.is_Admin,
            UsuarioPost.descripcion,
            UsuarioPost.intereses,
            hashedPassword,
          ]
        );

        if (res.rows.length === 0) {
          return reply.code(400).send({ message: "Usuario no creado" });
        }

        const id = res.rows[0].id;
        reply.code(201).send({
          id,
          ...UsuarioPost,
          contrasena: undefined,
        });
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        reply.code(500).send({ message: "Error en el servidor" });
      }
    },
  });
};
export default usuarioLoginRoute;

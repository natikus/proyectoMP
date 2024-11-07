import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { UsuarioPostSchema, UsuarioPostType } from "../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from "bcrypt";
import { Type } from "@sinclair/typebox";
import path from "path";
import { writeFileSync } from "fs";

const usuarioAuthRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para crear un usuario
  fastify.post("/", {
    schema: {
      tags: ["usuarios"],
      consumes: ["multipart/form-data"],
      body: UsuarioPostSchema,
    },

    handler: async function (request, reply) {
      const personaPost = request.body as UsuarioPostType;

      let imageUrl = "";
      if (personaPost.imagen) {
        const fileBuffer = personaPost.imagen._buf as Buffer;
        const filepath = path.join(
          process.cwd(),
          "uploads",
          personaPost.imagen.filename
        );
        writeFileSync(filepath, fileBuffer);
        imageUrl = `/uploads/${personaPost.imagen.filename}`;
      }
      const nombre = personaPost.nombre.value;
      const email = personaPost.email.value;
      const apellido = personaPost.apellido.value;
      const usuario = personaPost.usuario.value;
      const descripcion = personaPost.descripcion.value;
      const intereses = personaPost.intereses.value;
      const telefono = personaPost.telefono.value;
      const hashedPassword = await bcrypt.hash(
        personaPost.contrasena.value,
        10
      );

      const res = await query(
        `INSERT INTO usuarios
       (nombre, apellido, usuario, email, descripcion, intereses, telefono, contrasena, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id_persona;`,
        [
          nombre,
          apellido,
          usuario,
          email,
          descripcion,
          intereses,
          telefono,
          hashedPassword,
          imageUrl,
        ]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Failed to insert persona" });
        return;
      }

      const id_persona = res.rows[0].id_persona;
      reply.code(201).send({
        id_persona,
        nombre,
        apellido,
        usuario,
        descripcion,
        intereses,
        telefono,
        imageUrl,
      });
    },
  });
  fastify.get("/", {
    schema: {
      tags: ["auth"],
      summary: "Obtener todos los nombres y contraseñas usuarios",
      description:
        "Retorna una lista de todos los nombre y contraseñas usuarios registrados",
      response: {
        200: {
          type: "array",
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const res = await query(`SELECT
        email
        FROM usuarios`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay usuarios registradas" });
        return;
      }
      return res.rows;
    },
  });
  fastify.get("/intereses", {
    schema: {
      tags: ["usuarios"],
      summary: "Obtener todos los intereses registrados",
      description: "Retorna una lista de todos los intereses existentes",
      response: {
        200: {
          type: "array",
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },

    handler: async function (request, reply) {
      const res = await query(`SELECT
        intereses
        FROM usuarios`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay intereses registrados" });
        return;
      }
      return res.rows;
    },
  });
};
export default usuarioAuthRoute;

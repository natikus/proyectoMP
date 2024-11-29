import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { UsuarioPostSchema, UsuarioPostType } from "../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from "bcrypt";
import path from "path";
import { writeFileSync } from "fs";
import sharp from "sharp";
import { randomUUID } from "crypto";
const usuarioAuthRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para crear un usuario

  // Ruta para crear una nueva persona

  fastify.post("/", {
    schema: {
      summary: "Crear un usuario",
      description: "Crea un nuevo usuario en la base de datos.",
      tags: ["persona"],
      consumes: ["multipart/form-data"],
      body: UsuarioPostSchema,
    },

    handler: async function (request, reply) {
      const usuarioPost = request.body as UsuarioPostType;

      let imageUrl = "";
      if (usuarioPost.imagen) {
        try {
          const fileBuffer = usuarioPost.imagen._buf as Buffer;

          // Convertir la imagen a formato JPEG con sharp
          const uniqueFilename = `${randomUUID()}.jpg`;
          const filepath = path.join(process.cwd(), "uploads", uniqueFilename);

          // Procesar y guardar la imagen como JPEG
          const processedImage = await sharp(fileBuffer)
            .jpeg({ quality: 80 }) // Calidad de compresión del JPEG
            .toBuffer();

          writeFileSync(filepath, processedImage); // Guardar la imagen procesada en el sistema de archivos
          imageUrl = uniqueFilename;
        } catch (err) {
          console.error("Error al procesar la imagen:", err);
          reply.code(500).send({ message: "Error al procesar la imagen" });
          return;
        }
      }

      const nombre = usuarioPost.nombre.value;
      const apellido = usuarioPost.apellido.value;
      const email = usuarioPost.email.value;
      const usuario = usuarioPost.usuario.value;
      const descripcion = usuarioPost.descripcion.value;

      let intereses: string[];
      try {
        intereses = JSON.parse(usuarioPost.intereses.value);
      } catch (e) {
        reply.code(400).send({ message: "Formato de intereses inválido" });
        return;
      }

      const telefono = usuarioPost.telefono.value;

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(
        usuarioPost.contrasena.value,
        10
      );

      const res = await query(
        `INSERT INTO usuarios
         (
          nombre,
          apellido,
          usuario,
          descripcion,
          intereses,
          email,
          telefono,
          contrasena,
          imagen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id_persona;`,
        [
          nombre,
          apellido,
          usuario,
          descripcion,
          intereses,
          email,
          telefono,
          hashedPassword,
          imageUrl,
        ]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Failed to insert persona" });
        return;
      }

      const recipient = email;
      fastify.mailer.sendMail({
        from: process.env.user,
        to: recipient,
        subject: "Registro exitoso",
        text: "Bienvenido a Mutual purpose, esperamos que te sientas cómodo con nuestra comunidad. No olvides que el propósito de esta aplicación es ayudar a las demás personas y evitar el desperdicio y contaminación.",
      });

      const id_persona = res.rows[0].id_persona;

      const tokenPayload = {
        id_persona,
        email,
        nombre,
        apellido,
        usuario,
        imagen: imageUrl,
        descripcion,
        intereses,
        telefono,
        is_Admin: false,
      };

      const token = fastify.jwt.sign(tokenPayload);

      reply.code(201).send({
        id_persona,
        nombre,
        apellido,
        usuario,
        descripcion,
        intereses,
        telefono,
        imageUrl,
        token,
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

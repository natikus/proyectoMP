import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import {
  UsuarioIdSchema,
  UsuarioIdType,
  UsuarioPutSchema,
  UsuarioPutType,
  UsuarioSchema,
} from "../../tipos/usuario.js";
import { publicacionSchema } from "../../tipos/publicacion.js";
import bcrypt from "bcrypt";
import path from "path";
import { writeFileSync } from "fs";
import fs from "fs";
import sharp from "sharp";
import { randomUUID } from "crypto";
const usuariosRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todos los usuarios
  fastify.get("/", {
    schema: {
      tags: ["usuarios"],
      summary: "Obtener todos los usuarios",
      description: "Retorna una lista de todos los usuarios registrados",
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
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await query(`SELECT
        id_persona,
        
        nombre, 
        apellido,
        usuario,
        email,
        imagen,
        is_Admin,
        descripcion,
        intereses,
        telefono
        FROM usuarios`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay usuarios registrados" });
        return;
      }
      return res.rows;
    },
  });
  fastify.get("/:id_persona", {
    schema: {
      tags: ["usuarios"],
      summary: "Obtener un usuario específico",
      description: "Obtiene los detalles de un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: UsuarioSchema,
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: string };
      const res = await query(
        `
        SELECT id_persona, nombre, apellido, usuario, email, imagen, 
               is_Admin, descripcion, intereses, telefono 
        FROM usuarios WHERE id_persona = $1;`,
        [id_persona]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      return res.rows[0];
    },
  });

  // Ruta para eliminar un usuario
  fastify.delete("/:id_persona", {
    schema: {
      tags: ["usuarios"],
      summary: "Eliminar un usuario",
      description: "Elimina un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: UsuarioIdSchema,
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.verifySelfOrAdmin,
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: string };
      await query(`DELETE FROM publicaciones WHERE id_creador = $1;`, [
        id_persona,
      ]);
      const res = await query(`DELETE FROM usuarios WHERE id_persona = $1;`, [
        id_persona,
      ]);

      if (res.rowCount === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      reply.code(200).send({ message: "Usuario eliminado", id_persona });
    },
  });
  fastify.put("/:id_persona", {
    schema: {
      summary: "Actualizar un usuario existente",
      description: "Actualiza los datos de un usuario, incluyendo su imagen.",
      tags: ["persona"],
      consumes: ["multipart/form-data"],
      body: UsuarioPutSchema,
    },

    handler: async function (request, reply) {
      const usuarioPut = request.body as UsuarioPutType;
      const { id_persona } = request.params as UsuarioIdType;

      // Validar que el usuario existe
      const userQuery = await query(
        `SELECT imagen FROM usuarios WHERE id_persona = $1`,
        [id_persona]
      );
      if (userQuery.rowCount === 0) {
        reply.code(404).send({ message: "Usuario no encontrado" });
        return;
      }

      const previousImage = userQuery.rows[0].imagen;
      let newImageUrl = previousImage;

      // Procesar nueva imagen si se incluye
      if (usuarioPut.imagen) {
        try {
          const fileBuffer = usuarioPut.imagen._buf as Buffer;

          // Generar un nuevo nombre único para la imagen
          const uniqueFilename = `${randomUUID()}.jpg`;
          const filepath = path.join(process.cwd(), "uploads", uniqueFilename);

          // Procesar y guardar la nueva imagen
          const processedImage = await sharp(fileBuffer)
            .jpeg({ quality: 80 }) // Calidad de compresión del JPEG
            .toBuffer();
          writeFileSync(filepath, processedImage);

          // Actualizar la URL de la imagen con el nuevo nombre
          newImageUrl = uniqueFilename;

          // Eliminar la imagen anterior si existe y no es genérica
          if (previousImage && previousImage !== "default.jpg") {
            const previousImagePath = path.join(
              process.cwd(),
              "uploads",
              previousImage
            );
            if (fs.existsSync(previousImagePath)) {
              fs.unlinkSync(previousImagePath);
            }
          }
        } catch (err) {
          console.error("Error al procesar la nueva imagen:", err);
          reply
            .code(500)
            .send({ message: "Error al procesar la nueva imagen" });
          return;
        }
      }

      const usuario = usuarioPut.usuario.value;
      const descripcion = usuarioPut.descripcion.value;

      let intereses: string[];
      try {
        intereses = JSON.parse(usuarioPut.intereses.value);
      } catch (e) {
        reply.code(400).send({ message: "Formato de intereses inválido" });
        return;
      }

      const telefono = usuarioPut.telefono.value;
      const hashedPassword = await bcrypt.hash(usuarioPut.contrasena.value, 10);

      try {
        // Actualizar los datos del usuario en la base de datos
        const updateResult = await query(
          `UPDATE usuarios
           SET usuario = $1,
               descripcion = $2,
               intereses = $3,
               telefono = $4,
               contrasena = $5,
               imagen = $6
           WHERE id_persona = $7`,
          [
            usuario,
            descripcion,
            intereses,
            telefono,
            hashedPassword,
            newImageUrl,
            id_persona,
          ]
        );

        if (updateResult.rowCount === 0) {
          reply.code(500).send({ message: "Error al actualizar el usuario" });
          return;
        }

        reply.code(200).send({
          message: "Usuario actualizado con éxito",
          usuario: {
            usuario,
            descripcion,
            intereses,
            telefono,
            imagen: newImageUrl,
          },
        });
      } catch (error) {
        console.error("Error al actualizar los datos del usuario:", error);
        reply
          .code(500)
          .send({ message: "Error al actualizar los datos del usuario" });
      }
    },
  });

  fastify.get("/:id_persona/publicaciones", {
    schema: {
      summary: "Obtener las publicaciones de una persona especifica",
      description:
        "Obtiene la publicación correspondiente al usuario con ID especificado.",
      tags: ["publicacion"],
      response: {
        200: {
          description: "Publicación encontrada",
          type: "object",
          properties: publicacionSchema.properties,
        },
        404: {
          description: "Publicación no encontrada",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: number };

      const res = await query(
        `
            SELECT
              id_publicacion,
              titulo,
              estado,
              id_creador,
              descripcion,
              imagenes,
              ubicacion
            FROM publicaciones WHERE id_creador = $1;`,
        [id_persona]
      );
      if (res.rows.length === 0) {
        reply.code(404).send({
          message: "publicación no encontrada o no tiene publicaciones aún",
        });
        return;
      }
      return res.rows[0];
    },
  });
};

export default usuariosRoute;

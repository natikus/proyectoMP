import {
  publicacionPutSchema,
  publicacionPutType,
  publicacionPostType,
  publicacionPostSchema,
  publicacionIdSchema,
  publicacionSchema,
} from "../../tipos/publicacion.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";

import { Type } from "@sinclair/typebox";
// Definición del plugin de ruta
const publicacionRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todas las publicaciones
  fastify.get("/", {
    schema: {
      summary: "Obtener todas las publicaciones",
      description:
        "Obtiene una lista de todas las publicaciones vigentes que se han creado.",
      tags: ["publicacion"],
      response: {
        200: {
          description: "Lista de publicaciones vigentes completa.",

          type: "array",
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await query(`
            SELECT
                id_publicacion,
                titulo,
                estado,
                id_creador,
                descripcion,
                imagenes,
                ubicacion,
                fechaCreacion
            FROM publicaciones WHERE estado = true;`);

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay publicaciones registradas" });
        return;
      }
      return res.rows;
    },
  });

  // Ruta para crear un nuevo publicacion
  fastify.post("/", {
    schema: {
      summary: "Crear una nueva publicacion",
      description:
        "Crea una nueva publicación con la información proporcionada en el cuerpo de la solicitud.",
      body: publicacionPostSchema,
      tags: ["publicacion"],
      response: {
        201: {
          description: "Publicación creada con éxito.",
          content: {
            "application/json": {
              schema: { publicacionPostSchema, publicacionIdSchema },
            },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const publicacionPost = request.body as publicacionPostType;

      const res = await query(
        `INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion, etiquetas)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_publicacion;`,
        [
          publicacionPost.titulo,
          publicacionPost.id_creador,
          publicacionPost.descripcion,
          publicacionPost.imagenes,
          publicacionPost.ubicacion,
        ]
      );

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "publicacion no creada" });
        return;
      }

      const id_publicacion = res.rows[0].id_publicacion;
      reply.code(201).send({ id_publicacion, ...publicacionPost });
    },
  });

  // Ruta para eliminar un publicacion
  fastify.delete("/:id_publicacion", {
    schema: {
      summary: "Eliminar una publicacion",
      description:
        "Elimina una publicación basada en el ID proporcionado en los parámetros.",
      tags: ["publicacion"],
      params: publicacionIdSchema,
      response: {
        200: {
          description: "Publicación eliminada con éxito.",
          content: {
            "application/json": {
              schema: publicacionIdSchema,
            },
          },
        },
        404: {
          description: "publicacion no encontrada.",
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
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_publicacion } = request.params as { id_publicacion: number };
      const res = await query(
        `DELETE FROM publicaciones WHERE id_publicacion = $1;`,
        [id_publicacion]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "publicacion no encontrada" });
        return;
      }
      reply
        .code(200)
        .send({ message: "publicacion eliminado", id_publicacion });
    },
  });

  // Ruta para actualizar un publicacion
  fastify.put("/:id_publicacion", {
    schema: {
      summary: "Actualizar una publicacion",
      description:
        "Actualiza los detalles de una publicación existente basada en el ID proporcionado en los parámetros.",
      tags: ["publicacion"],
      params: publicacionIdSchema,
      body: publicacionPutSchema,
      response: {
        200: {
          description: "Publicación actualizada con éxito.",
          content: {
            "application/json": {
              schema: publicacionPutSchema,
            },
          },
        },
        404: {
          description: "publicacion no encontrada.",
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
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_publicacion } = request.params as { id_publicacion: number };
      const publicacionPut = request.body as publicacionPutType;

      // Obtener el ID del token JWT
      const userIdFromToken = request.user.id_usuario;

      // Verificar si el usuario autenticado es el creador de la publicacion
      const publicacionRes = await query(
        `SELECT id_creador FROM publicaciones WHERE id_publicacion = $1;`,
        [id_publicacion]
      );
      if (
        publicacionRes.rows.length === 0 ||
        publicacionRes.rows[0].id_creador !== userIdFromToken
      ) {
        return reply
          .code(403)
          .send({
            message: "No tienes permiso para modificar esta publicacion",
          });
      }

      const res = await query(
        `
            UPDATE publicaciones
            SET titulo = COALESCE($1, titulo),
                descripcion = COALESCE($2, descripcion),
                imagenes = COALESCE($3, imagenes),
                ubicacion = COALESCE($4, ubicacion),
            WHERE id_publicacion = $6
            RETURNING id_publicacion;`,
        [
          publicacionPut.titulo,
          publicacionPut.descripcion,
          publicacionPut.imagenes,
          publicacionPut.ubicacion,
          id_publicacion,
        ]
      );

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "publicacion no encontrada" });
        return;
      }
      reply.code(200).send({ ...publicacionPut, id_publicacion });
    },
  });

  // Ruta para ver los detalles de una publicacion específica
  fastify.get("/:id_publicacion", {
    schema: {
      summary: "Obtener detalles de una publicaciont",
      description:
        "Obtiene los detalles completos de una publicación basada en el ID proporcionado.",
      tags: ["publicacion"],
      params: publicacionIdSchema,
      response: {
        200: {
          description: "Detalles de la publicación obtenidos correctamente.",
          content: {
            "application/json": {
              schema: publicacionSchema,
            },
          },
        },
        404: {
          description: "publicacion no encontrada.",
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
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_publicacion } = request.params as { id_publicacion: number };
      const res = await query(
        `
            SELECT
                id_publicacion,
                titulo,
                estado,
                id_creador,
                descripcion,
                imagenes,
                ubicacion,
                fechaCreacion
            FROM publicaciones WHERE id_publicacion = $1;`,
        [id_publicacion]
      );

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "publicacion no encontrada" });
        return;
      }
      return res.rows[0];
    },
  });
};

export default publicacionRoute;

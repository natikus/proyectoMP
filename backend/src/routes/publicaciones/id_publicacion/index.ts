import {
  publicacionPutSchema,
  publicacionPutType,
  publicacionIdSchema,
  publicacionSchema,
} from "../../../tipos/publicacion.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../../services/database.js";
import { Type } from "@sinclair/typebox";
const publicacionRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para eliminar un publicacion
  fastify.delete("/", {
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
  fastify.put("/", {
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
      const userIdFromToken = request.user.id_persona;
      const publicacionRes = await query(
        `SELECT id_creador FROM publicaciones WHERE id_publicacion = $1;`,
        [id_publicacion]
      );
      if (
        publicacionRes.rows.length === 0 ||
        publicacionRes.rows[0].id_creador !== userIdFromToken
      ) {
        return reply.code(403).send({
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
};

export default publicacionRoute;

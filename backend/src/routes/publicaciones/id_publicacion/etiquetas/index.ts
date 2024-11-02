import {
  etiquetaSchema,
  etiquetaIdSchema,
} from "../../../../tipos/etiqueta.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../../../services/database.js";
import { Type } from "@sinclair/typebox";
const etiquetaPublicacionRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para eliminar una etiqueta
  fastify.delete("/", {
    schema: {
      summary: "Eliminar una etiqueta",
      description: "Elimina una etiqueta por ID.",
      tags: ["etiqueta"],
      params: etiquetaIdSchema,
      response: {
        200: {
          description: "Etiqueta eliminada con éxito.",
          content: {
            "application/json": {
              schema: etiquetaIdSchema,
            },
          },
        },
        404: {
          description: "Etiqueta no encontrada.",
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
    onRequest: fastify.verifyAdmin,
    handler: async function (request, reply) {
      const { id_etiqueta } = request.params as { id_etiqueta: number };
      const res = await query(`DELETE FROM etiquetas WHERE id_etiqueta = $1;`, [
        id_etiqueta,
      ]);
      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Etiqueta no encontrada" });
        return;
      }
      reply.code(200).send({ message: "Etiqueta eliminada", id_etiqueta });
    },
  });

  // Ruta para ver los detalles de una etiqueta específica
  fastify.get("/", {
    schema: {
      summary: "Obtener las etiquetas de la publicacion",
      description: "Obtiene las etiquetas de una publicaicon por ID.",
      tags: ["etiqueta"],
      response: {
        200: {
          description: "Etiquetas encontradas",
          type: "object",
          properties: etiquetaSchema.properties,
        },
        404: {
          description: "Etiquetas no encontradas",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_publicaicon } = request.params as { id_publicaicon: number };
      const res = await query(
        `SELECT id_etiqueta, etiqueta FROM etiquetas WHERE id_publicaicon = $1;`,
        [id_publicaicon]
      );
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Etiqueta no encontrada" });
        return;
      }
      return res.rows[0];
    },
  });
};

export default etiquetaPublicacionRoute;

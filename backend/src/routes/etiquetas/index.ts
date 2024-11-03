import { etiquetaSchema, etiquetaIdSchema } from "../../tipos/etiqueta.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import { Type } from "@sinclair/typebox";
const etiquetaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para ver los detalles de una etiqueta específica

  fastify.get("/", {
    schema: {
      summary: "Obtener todas las etiquetas",
      description: "Obtener todas las etiquetas",
      tags: ["etiqueta"],
      response: {
        200: {
          description: "Etiquetas encontradas",
          type: "array",
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
      const res = await query(`SELECT etiqueta FROM etiquetas`); // Obtener todas las columnas
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay etiquetas creadas" });
        return;
      }
      return res.rows; // Devuelve todas las etiquetas
    },
  });

  // Ruta para crear una nueva etiqueta
  fastify.post("/", {
    schema: {
      summary: "Crear una etiqueta",
      description: "Crea una nueva etiqueta.",
      tags: ["etiqueta"],
      body: etiquetaSchema,
      response: {
        201: {
          description: "Etiqueta creada con éxito.",
          content: {
            "application/json": {
              schema: etiquetaSchema,
            },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { etiqueta } = request.body as { etiqueta: string };
      const res = await query(
        `INSERT INTO etiquetas etiqueta VALUES ($1) RETURNING id_etiqueta, etiqueta;`,
        [etiqueta]
      );
      reply.code(201).send(res.rows[0]);
    },
  });
  // Ruta para eliminar una etiqueta
  fastify.delete("/:id_etiqueta", {
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
    onRequest: fastify.verifySelfOrAdmin,
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
};

export default etiquetaRoute;

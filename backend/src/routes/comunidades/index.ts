import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import { Type } from "@sinclair/typebox";
import {
  comunidadIdSchema,
  comunidadPostSchema,
  comunidadPostSchemaType,
  comunidadSchema,
} from "../../tipos/comunidad.js";
const comunidadRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para crear una nueva comunidad
  fastify.post("/", {
    schema: {
      summary: "Crear una comunidad",
      description: "Crea una nueva comunidad.",
      tags: ["comunidad"],
      body: comunidadPostSchema,

      response: {
        201: {
          description: "Comunidad creada con éxito.",
          content: {
            "application/json": {
              schema: comunidadSchema,
            },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { comunidad } = request.body as comunidadPostSchemaType;
      const nombre = comunidad.value;
      const res = await query(
        `INSERT INTO comunidades (comunidad) VALUES ($1) RETURNING id_comunidad, comunidad;`,
        [nombre]
      );
      reply.code(201).send(res.rows[0]);
    },
  });

  // Ruta para eliminar una etiqueta
  fastify.delete("/:id_comunidad", {
    schema: {
      summary: "Eliminar una comunidad",
      description: "Elimina una comunidad por ID.",
      tags: ["comunidad"],
      params: comunidadIdSchema,
      response: {
        200: {
          description: "Etiqueta comunidad con éxito.",
          content: {
            "application/json": {
              schema: comunidadIdSchema,
            },
          },
        },
        404: {
          description: "comunidad no encontrada.",
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
      const { id_comunidad } = request.params as { id_comunidad: number };
      const res = await query(
        `DELETE FROM comunidades WHERE id_comunidad = $1;`,
        [id_comunidad]
      );
      if (res.rowCount === 0) {
        reply.code(404).send({ message: "comunidad no encontrada" });
        return;
      }
      reply.code(200).send({ message: "comunidad eliminada", id_comunidad });
    },
  });
  fastify.get("/", {
    schema: {
      summary: "Obtener todas las comunidades",
      description: "Obtener todas las comunidades",
      tags: ["comunidad"],
      response: {
        200: {
          description: "Comunidades encontradas",
          type: "array",
        },
        404: {
          description: "Comunidades no encontradas",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await query(`SELECT comunidades FROM comunidades`); // Obtener todas las columnas
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay comunidades creadas" });
        return;
      }
      return res.rows; // Devuelve todas las comunidades
    },
  });
  fastify.post("/:id_comunidad", {
    schema: {
      summary: "Unirse a una comunidad",
      description: "Unirse a una comunidad.",
      tags: ["comunidad"],
      body: {
        type: "array",
        items: {
          type: "string", // Ahora recibimos el nombre de la etiqueta
          description: "Nombre de la comunidad a asociar",
        },
        minItems: 1, // Requiere al menos una etiqueta
      },
      response: {
        200: {
          description: "comunidad asociadas correctamente",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        400: {
          description: "Petición inválida",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        404: {
          description: "comunidad no encontrada",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        500: {
          description: "Error interno del servidor",
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
      const comunidad = request.body as string;
      console.log("Asociando a LA COMUNIDAD", request.body);

      try {
        // Verifica si la comunidad existe
        const resPublicacion = await query(
          `SELECT id_comunidad FROM comunidades WHERE id_comunidad = $1`,
          [id_persona]
        );

        if (resPublicacion.rows.length === 0) {
          reply.code(404).send({
            message: "Publicación no encontrada.",
          });
          return;
        }

        const res = await query(
          `INSERT INTO usuario_comunidad (id_persona, id_comunidad) VALUES ($1, $2) RETURNING *;`,
          [id_persona, comunidad]
        );

        reply.code(200).send({
          message: "Publicaicon asociada correctamente.",
        });
      } catch (error) {
        console.error("Error al asociar publicacion:", error);
        reply.code(500).send({
          message: "Error interno del servidor.",
        });
      }
    },
  });
};

export default comunidadRoute;

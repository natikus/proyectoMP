import {
  publicacionPostType,
  publicacionPostSchema,
  publicacionIdSchema,
  publicacionSchema,
  publicacionPutSchema,
} from "../../tipos/publicacion.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import { Type } from "@sinclair/typebox";
import path from "path";
import { writeFileSync } from "fs";
import { randomUUID } from "crypto";
const publicacionesRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  fastify.post("/", {
    schema: {
      summary: "Crear una nueva publicación",
      description: "Crea una nueva publicación en la base de datos.",
      tags: ["publicacion"],
      consumes: ["multipart/form-data"],
      body: publicacionPostSchema,
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const publicacion = request.body as publicacionPostType;

      let imageUrl = "";
      if (publicacion.imagenes) {
        const fileBuffer = publicacion.imagenes._buf as Buffer;

        // Generar un nombre único para la imagen
        const uniqueFilename = `${randomUUID()}_${
          publicacion.imagenes.filename
        }`;
        const filepath = path.join(
          process.cwd(),
          "uploads",
          "publicaciones",
          uniqueFilename
        );

        // Guardar la imagen en el sistema de archivos
        writeFileSync(filepath, fileBuffer);

        // Crear la URL para la imagen
        imageUrl = `/uploads/publicaciones/${uniqueFilename}`;
        console.log(imageUrl);
      }

      const titulo = publicacion.titulo.value;
      const descripcion = publicacion.descripcion.value;
      const ubicacion = publicacion.ubicacion.value;
      const id_creador = publicacion.id_creador.value;

      const res = await query(
        `
          INSERT INTO publicaciones (titulo, descripcion, imagenes, ubicacion, id_creador, estado)
          VALUES ($1, $2, $3, $4, $5, true)
          RETURNING *;
        `,
        [titulo, descripcion, imageUrl, ubicacion, id_creador]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Error al crear la publicación " });
        return;
      }

      const id_publicacion = res.rows[0].id_publicacion;
      reply.code(201).send({
        id_publicacion,
        titulo,
        descripcion,
        imageUrl,
        ubicacion,
        id_creador,
      });
    },
  });
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
                ubicacion
            FROM publicaciones WHERE estado = true;`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay publicaciones registradas" });
        return;
      }
      console.log(res);
      return res.rows;
    },
  });

  // Ruta para ver los detalles de una etiqueta específica
  fastify.get("/:id_publicacion/etiquetas", {
    schema: {
      summary: "Obtener las etiquetas de la publicación",
      description: "Obtiene las etiquetas de una publicación por ID.",
      tags: ["etiqueta"],
      response: {
        200: {
          description: "Etiquetas encontradas",
          type: "array", // Cambiamos a tipo "array" para reflejar que se retorna una lista de etiquetas
          items: {
            type: "object",
            properties: {
              id_etiqueta: { type: "integer" },
              etiqueta: { type: "string" },
            },
          },
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
      const { id_publicacion } = request.params as { id_publicacion: number };

      try {
        const res = await query(
          `
          SELECT e.id_etiqueta, e.etiqueta
          FROM etiquetas e
          JOIN publicacion_etiquetas pe ON e.id_etiqueta = pe.id_etiqueta
          WHERE pe.id_publicacion = $1;`,
          [id_publicacion]
        );

        if (res.rows.length === 0) {
          reply.code(404).send({
            message: "No se encontraron etiquetas para esta publicación.",
          });
          return;
        }

        return res.rows;
      } catch (error) {
        console.error("Error al obtener etiquetas:", error);
        reply.code(500).send({ message: "Error interno del servidor." });
      }
    },
  });
  fastify.post("/:id_publicacion/etiquetas", {
    schema: {
      summary: "Asociar etiquetas a una publicación",
      description:
        "Asocia una o varias etiquetas a una publicación, creando las etiquetas si no existen.",
      tags: ["etiqueta"],
      body: {
        type: "array",
        items: {
          type: "string", // Ahora recibimos el nombre de la etiqueta
          description: "Nombre de la etiqueta a asociar",
        },
        minItems: 1, // Requiere al menos una etiqueta
      },
      response: {
        200: {
          description: "Etiquetas asociadas correctamente",
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
          description: "Publicación no encontrada",
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
      const { id_publicacion } = request.params as { id_publicacion: number };
      const etiquetas = request.body as string[];
      console.log("REQUEST DEL BODYYY", request.body);
      console.log(etiquetas, "ECONTRE ESTAS ETIQUETAS");
      if (!etiquetas || etiquetas.length === 0) {
        reply.code(400).send({
          message: "Debe proporcionar al menos una etiqueta.",
        });
        return;
      }

      try {
        // Verifica si la publicación existe
        const resPublicacion = await query(
          `SELECT id_publicacion FROM publicaciones WHERE id_publicacion = $1`,
          [id_publicacion]
        );

        if (resPublicacion.rows.length === 0) {
          reply.code(404).send({
            message: "Publicación no encontrada.",
          });
          return;
        }

        // Para cada etiqueta, verificamos si ya existe en la base de datos
        const idsEtiquetas: number[] = [];
        for (const etiqueta of etiquetas) {
          // Primero, intentamos encontrar la etiqueta por nombre
          const resEtiqueta = await query(
            `SELECT id_etiqueta FROM etiquetas WHERE etiqueta = $1`,
            [etiqueta]
          );

          if (resEtiqueta.rows.length > 0) {
            // Si la etiqueta existe, la agregamos a la lista de IDs
            idsEtiquetas.push(resEtiqueta.rows[0].id_etiqueta);
          } else {
            // Si no existe, la creamos y obtenemos su ID
            const resNuevaEtiqueta = await query(
              `INSERT INTO etiquetas (etiqueta) VALUES ($1) RETURNING id_etiqueta`,
              [etiqueta]
            );
            idsEtiquetas.push(resNuevaEtiqueta.rows[0].id_etiqueta);
          }
        }

        // Insertamos las relaciones entre la publicación y las etiquetas
        const values = idsEtiquetas
          .map((etiquetaId) => `(${id_publicacion}, ${etiquetaId})`)
          .join(", ");

        await query(
          `INSERT INTO publicacion_etiquetas (id_publicacion, id_etiqueta) VALUES ${values}`
        );

        reply.code(200).send({
          message: "Etiquetas asociadas correctamente.",
        });
      } catch (error) {
        console.error("Error al asociar etiquetas:", error);
        reply.code(500).send({
          message: "Error interno del servidor.",
        });
      }
    },
  });

  fastify.get("/:id_publicacion", {
    schema: {
      summary: "Obtener una publicación específica",
      description:
        "Obtiene los detalles de una publicación específica por su ID.",
      tags: ["publicacion"],
      params: {
        type: "object",
        properties: {
          id_publicacion: {
            type: "integer",
            description: "ID de la publicación",
          },
        },
        required: ["id_publicacion"],
      },
      response: {
        200: {
          description: "Detalles de la publicación solicitada.",
          type: "object",
          properties: {
            id_publicacion: { type: "integer" },
            titulo: { type: "string" },
            estado: { type: "boolean" },
            id_creador: { type: "integer" },
            descripcion: { type: "string" },
            imagenes: { type: "string" },
            ubicacion: { type: "string" },
          },
        },
        404: {
          description: "Publicación no encontrada.",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_publicacion } = request.params as { id_publicacion: number };
      console.log("id_publicacion obtenida");
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
            FROM publicaciones 
            WHERE id_publicacion = $1 AND estado = true;
          `,
        [id_publicacion]
      );
      console.log("aca si");
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Publicación no encontrada" });
        return;
      }
      console.log("esto es una publicacion del back", res.rows[0]);
      return res.rows[0];
    },
  });

  // Ruta para actualizar una publicación
  fastify.put("/:id_publicacion", {
    schema: {
      summary: "Actualizar una publicación",
      description:
        "Actualiza la publicación correspondiente al ID especificado.",
      tags: ["publicacion"],
      body: publicacionPutSchema, // Esquema para validar el cuerpo de la solicitud PUT
      response: {
        200: {
          description: "Publicación actualizada",
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
      const { id_publicacion } = request.params as { id_publicacion: number };
      const { titulo, descripcion, imagenes, ubicacion } = request.body as {
        titulo?: string;
        descripcion?: string;
        imagenes?: string[];
        ubicacion?: string;
      };

      const res = await query(
        `
          UPDATE publicaciones
          SET 
            titulo = COALESCE($1, titulo),
            descripcion = COALESCE($2, descripcion),
            imagenes = COALESCE($3, imagenes),
            ubicacion = COALESCE($4, ubicacion)
          WHERE id_publicacion = $5
          RETURNING *;
        `,
        [titulo, descripcion, imagenes, ubicacion, id_publicacion]
      );

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "publicación no encontrada" });
        return;
      }

      return res.rows[0];
    },
  });

  // Ruta para eliminar una publicación
  fastify.delete("/:id_publicacion", {
    schema: {
      summary: "Eliminar una publicación",
      description:
        "Elimina una publicación basada en el ID proporcionado en los parámetros.",
      tags: ["publicacion"],
      params: publicacionIdSchema,
      response: {
        200: {
          description: "Publicación eliminada con éxito.",
          content: {
            "application/json": {
              schema: Type.Object({
                message: Type.String(),
                id_publicacion: Type.Number(),
              }),
            },
          },
        },
        404: {
          description: "Publicación no encontrada.",
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
        reply.code(404).send({ message: "publicación no encontrada" });
        return;
      }
      reply
        .code(200)
        .send({ message: "publicación eliminada", id_publicacion });
    },
  });
};

export default publicacionesRoute;

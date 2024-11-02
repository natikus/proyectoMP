import {
  publicacionPostType,
  publicacionPostSchema,
  publicacionIdSchema,
  publicacionSchema,
} from "../../tipos/publicacion.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
const publicacionesRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para ver los detalles de una publicacion específica
  fastify.get("/:id_publicacion", {
    schema: {
      summary: "Obtener una publicación específica",
      description: "Obtiene la publicación correspondiente al ID especificado.",
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
      const { id_publicacion } = request.params as { id_publicacion: number };

      console.log(id_publicacion);
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
        `INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion, etiqueta)
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
};

export default publicacionesRoute;

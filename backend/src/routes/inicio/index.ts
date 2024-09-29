import { postPutSchema, postPutType, postPostType, postPostSchema, postIdSchema } from "../../tipos/post.js"
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";

// Definición del plugin de ruta
const postRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {

    // Ruta para obtener todos los posts
    fastify.get("/", {
        schema: {
            tags: ["post"], // Tag cambiado a 'post'
        },
        onRequest: fastify.authenticate,
        handler: async function (request, reply) {
            const res = await query(`
            SELECT
                id_post,
                titulo,
                estado,
                id_creador,
                descripcion,
                imagenes,
                ubicacion,
                fechaCreacion,
                etiquetas
            FROM publicaciones;`);

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "No hay posts registrados" });
                return;
            }
            return res.rows;
        }
    });

    // Ruta para crear un nuevo post
    fastify.post("/", {
        schema: {
            body: postPostSchema,
            tags: ["post"], // Tag cambiado a 'post'
            description: "Crea un nuevo post",
        },
        onRequest: fastify.authenticate,
        handler: async function (request, reply) {
            const postPost = request.body as postPostType;

            const res = await query(
                `INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion, etiquetas)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_post;`,
                [
                    postPost.titulo,
                    postPost.id_creador,
                    postPost.descripcion,
                    postPost.imagenes,
                    postPost.ubicacion,
                    postPost.etiquetas
                ]
            );

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Post no creado" });
                return;
            }

            const id_post = res.rows[0].id_post;
            reply.code(201).send({ id_post, ...postPost });
        }
    });

    // Ruta para eliminar un post
    fastify.delete("/:id_post", {
        schema: {
            tags: ["post"], // Tag cambiado a 'post'
            description: "Elimina un post por ID",
            params: postIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        id_post: { type: "string" }
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },
        onRequest: fastify.authenticate,
        handler: async function (request, reply) {
            const { id_post } = request.params as { id_post: number };
            const res = await query(`DELETE FROM publicaciones WHERE id_post = $1;`, [id_post]);

            if (res.rowCount === 0) {
                reply.code(404).send({ message: "Post no encontrado" });
                return;
            }
            reply.code(200).send({ message: "Post eliminado", id_post });
        }
    });

    // Ruta para actualizar un post
    fastify.put("/:id_post", {
        schema: {
            tags: ["post"], // Tag cambiado a 'post'
            description: "Actualiza un post por ID",
            params: postIdSchema,
            body: postPutSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        titulo: { type: "string" },
                        descripcion: { type: "string" },
                        imagenes: { type: "string" },
                        ubicacion: { type: "string" },
                        etiquetas: { type: "array", items: { type: "string" } },
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },
        onRequest: fastify.authenticate,
        handler: async function (request, reply) {
            const { id_post } = request.params as { id_post: number };
            const postPut = request.body as postPutType;

            // Obtener el ID del token JWT
            const userIdFromToken = request.user.id;

            // Verificar si el usuario autenticado es el creador del post
            const postRes = await query(`SELECT id_creador FROM publicaciones WHERE id_post = $1;`, [id_post]);
            if (postRes.rows.length === 0 || postRes.rows[0].id_creador !== userIdFromToken) {
                return reply.code(403).send({ message: "No tienes permiso para modificar este post" });
            }

            const res = await query(`
            UPDATE publicaciones
            SET titulo = COALESCE($1, titulo),
                descripcion = COALESCE($2, descripcion),
                imagenes = COALESCE($3, imagenes),
                ubicacion = COALESCE($4, ubicacion),
                etiquetas = COALESCE($5, etiquetas)
            WHERE id_post = $6
            RETURNING id_post;`,
                [postPut.titulo, postPut.descripcion, postPut.imagenes, postPut.ubicacion, postPut.etiquetas, id_post]);

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Post no encontrado" });
                return;
            }
            reply.code(200).send({ ...postPut, id_post });
        }
    });

    // Ruta para ver los detalles de un post específico
    fastify.get("/:id_post", {
        schema: {
            tags: ["post"], // Tag cambiado a 'post'
            description: "Obtiene los detalles de un post por ID",
            params: postIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        id_post: { type: "number" },
                        titulo: { type: "string" },
                        estado: { type: "string" },
                        id_creador: { type: "number" },
                        descripcion: { type: "string" },
                        imagenes: { type: "string" },
                        ubicacion: { type: "string" },
                        fechaCreacion: { type: "string", format: "date-time" },
                        etiquetas: { type: "array", items: { type: "string" } },
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },
        onRequest: fastify.authenticate,
        handler: async function (request, reply) {
            const { id_post } = request.params as { id_post: number };
            const res = await query(`
            SELECT
                id_post,
                titulo,
                estado,
                id_creador,
                descripcion,
                imagenes,
                ubicacion,
                fechaCreacion,
                etiquetas
            FROM publicaciones WHERE id_post = $1;`, [id_post]);

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Post no encontrado" });
                return;
            }
            return res.rows[0];
        }
    });
};

export default postRoute;

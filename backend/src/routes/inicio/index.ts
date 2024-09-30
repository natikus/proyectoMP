import { postPutSchema, postPutType, postPostType, postPostSchema, postIdSchema, postSchema } from "../../tipos/post.js"
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import { UsuarioSchema } from "../../tipos/usuario.js";
import { Type } from "@sinclair/typebox";
// Definición del plugin de ruta
const postRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {

    // Ruta para obtener todos los posts
    fastify.get("/", {
        schema: {
            summary: "Obtener todas las publicaciones",
            description: "Obtiene una lista de todas las publicaciones vigentes que se han creado.",
            tags: ["post"],
            response: {
                200: {
                    description: "Lista de publicaciones vigentes completa.",
                    content: {
                        "application/json": {
                            schema: Type.Array(postSchema),
                        },
                    },
                },
            },
            security: [{ bearerAuth: [] }],
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
            FROM publicaciones WHERE estado = true;`);

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
            summary: "Crear un nuevo post",
            description: "Crea una nueva publicación con la información proporcionada en el cuerpo de la solicitud.",
            body: postPostSchema,
            tags: ["post"],
            response: {
                201: {
                    description: "Publicación creada con éxito.",
                    content: {
                        "application/json": {
                            schema: { postPostSchema, postIdSchema },

                        },
                    },
                },
            },
            security: [{ bearerAuth: [] }],
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
            summary: "Eliminar un post",
            description: "Elimina una publicación basada en el ID proporcionado en los parámetros.",
            tags: ["post"],
            params: postIdSchema,
            response: {
                200: {
                    description: "Publicación eliminada con éxito.",
                    content: {
                        "application/json": {
                            schema: postIdSchema,
                        },
                    },
                },
                404: {
                    description: "Post no encontrado.",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                message: Type.String(),
                            }),
                        },
                    },
                },
            },
            security: [{ bearerAuth: [] }],
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
            summary: "Actualizar un post",
            description: "Actualiza los detalles de una publicación existente basada en el ID proporcionado en los parámetros.",
            tags: ["post"],
            params: postIdSchema,
            body: postPutSchema,
            response: {
                200: {
                    description: "Publicación actualizada con éxito.",
                    content: {
                        "application/json": {
                            schema: postPutSchema,
                        },
                    },
                },
                404: {
                    description: "Post no encontrado.",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                message: Type.String(),
                            }),
                        },
                    },
                },
            },
            security: [{ bearerAuth: [] }],
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
            summary: "Obtener detalles de un post",
            description: "Obtiene los detalles completos de una publicación basada en el ID proporcionado.",
            tags: ["post"],
            params: postIdSchema,
            response: {
                200: {
                    description: "Detalles de la publicación obtenidos correctamente.",
                    content: {
                        "application/json": {
                            schema: postSchema,
                        },
                    },
                },
                404: {
                    description: "Post no encontrado.",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                message: Type.String(),
                            }),
                        },
                    },
                },
            },
            security: [{ bearerAuth: [] }],
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

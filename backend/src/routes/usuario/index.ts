import { UsuarioIdSchema, UsuarioPostSchema, UsuarioPutSchema, UsuarioPutType, UsuarioPostType, UsuarioSchema } from "../../tipos/usuario.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";

// Definición del plugin de ruta
const usuarioRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {
    // Ruta para obtener todos los usuarios
    fastify.get("/", {
        schema: {
            tags: ["Usuario"],
            summary: "Obtener todos los usuarios",
            description: "Retorna una lista de todos los usuarios registrados",
            response: {
                200: {
                    type: "array",
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            },
            security: [{ BearerAuth: [] }]
        },
        onRequest: fastify.verifyAdmin,
        handler: async function (request, reply) {
            const res = await query(`SELECT
        id,
        nombre,
        apellido,
        usuario,
        cedula,
        email,
        telefono,
        foto,
        is_Admin,
        descripcion,
        fechaCreacion,
        intereses
        FROM usuarios`);
            if (res.rows.length === 0) {
                reply.code(404).send({ message: "No hay usuarios registradas" });
                return;
            }
            return res.rows;
        }
    });



    // Ruta para eliminar un usuario
    fastify.delete("/:id", {
        schema: {
            tags: ["Usuario"],
            summary: "Eliminar un usuario",
            description: "Elimina un usuario por ID",
            params: UsuarioIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {

                        id: { type: "string" }
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            },
            security: [{ BearerAuth: [] }]
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const resPublicaciones = await query(`DELETE FROM publicaciones WHERE id_creador = ${id};`);
            const res = await query(`DELETE FROM usuarios WHERE id = ${id};`);

            if (res.rowCount === 0) {
                reply.code(404).send({ message: "Usuario no encontrado" });
                return;
            }
            reply.code(200).send({ message: "Usuario eliminado", id, resPublicaciones });

        }
    });

    // Ruta para editar un Usuario
    fastify.put("/:id", {
        schema: {
            tags: ["Usuario"],
            summary: "Editar un usuario",
            description: "Actualiza un usuario por ID",
            params: UsuarioIdSchema,
            body: UsuarioPutSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        usuario: { type: "string" },
                        telefono: { type: "string" },
                        foto: { type: "string" },
                        descripcion: { type: "string" },
                        intereses: { type: "string" },
                        contrasena: { type: "string" }
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            },
            security: [{ BearerAuth: [] }]
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const usuarioPut = request.body as UsuarioPutType;

            // Obtener el ID del token JWT
            const userIdFromToken = request.user.id;  // Suponiendo que el token tiene un campo 'id'

            // Verificar si el usuario autenticado es el mismo que está siendo modificado
            if (userIdFromToken !== id) {
                return reply.code(403).send({ message: "No tienes permiso para modificar este usuario" });
            }

            // Actualizar el usuario en la base de datos usando COALESCE para mantener los valores actuales si no se envían nuevos
            const res = await query(
                `UPDATE usuarios
            SET usuario = COALESCE($1, usuario),
                telefono = COALESCE($2, telefono),
                foto = COALESCE($3, foto),
                descripcion = COALESCE($4, descripcion),
                intereses = COALESCE($5, intereses),
                contrasena = COALESCE($6, contrasena)
            WHERE id = $7
            RETURNING id;`,
                [
                    usuarioPut.usuario,
                    usuarioPut.telefono,
                    usuarioPut.foto,
                    usuarioPut.descripcion,
                    usuarioPut.intereses,
                    usuarioPut.contrasena,
                    id
                ]
            );

            if (res.rows.length === 0) {
                return reply.code(404).send({ message: "Usuario no encontrado" });
            }

            // Enviar respuesta con los datos actualizados
            reply.code(200).send({ ...usuarioPut, id });
        }
    });



    // Ruta para ver los datos de un Usuario específico
    fastify.get("/:id", {
        schema: {
            tags: ["Usuario"],
            summary: "Obtener un usuario específico",
            description: "Obtiene los detalles de un usuario por ID",
            params: UsuarioIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        nombre: { type: "string" },
                        apellido: { type: "string" },
                        usuario: { type: "string" },
                        cedula: { type: "string" },
                        email: { type: "string" },
                        telefono: { type: "string" },
                        foto: { type: "string" },
                        is_Admin: { type: "boolean" },
                        descripcion: { type: "string" },
                        intereses: { type: "array", items: { type: "string" } }
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            },
            security: [{ BearerAuth: [] }]
        },


        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const res = await query(`SELECT 
        id,
        nombre,
        apellido,
        usuario,
        cedula,
        email,
        telefono,
        foto,
        is_Admin,
        descripcion,
        fechaCreacion,
        intereses
        FROM usuarios WHERE id = ${id};`);

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Usuario no encontrado" });
                return;
            }
            const usuario = res.rows[0];
            return usuario;
        }
    });

};

export default usuarioRoute;
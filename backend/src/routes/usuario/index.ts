import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { UsuarioIdSchema, UsuarioPostSchema, UsuarioPutSchema, UsuarioPutType, UsuarioPostType } from "../../tipos/usuario.js";
import { query } from "../../services/database.js";

// Definición del plugin de ruta
const usuarioRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {
    // Ruta para obtener todos los usuarios
    fastify.get("/", {
        schema: {
            tags: ["usuario"],
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const res = await query(`SELECT
        id,
        nombre,
        apellido,
        usuario,
        cedula,
        email:,
        telefono,
        foto,
        isAdmin,
        descripcion,
        fechaCreacion,
        intereses,
        FROM usuarios`);
            if (res.rows.length === 0) {
                reply.code(404).send({ message: "No hay usuarios registradas" });
                return;
            }
            return res.rows;
        }
    });

    // Ruta para crear un nuevo Usuario
    fastify.post("/", {
        schema: {
            params: UsuarioPostSchema,
            tags: ["Usuario"],
            description: "Crea una nuevo usuario",
        },
        preHandler: [fastify.authenticate],
        handler: async function (request, reply) {
            const UsuarioPost = request.body as UsuarioPostType;
            const res = await query(`INSERT INTO usuarios
            (nombre,
            apellido,
            usuario,
            cedula,
            email:,
            telefono,
            foto,
            isAdmin,
            descripcion,
            fechaCreacion,
            intereses,
            contrasena,)
            VALUES
            ('${UsuarioPost.nombre}',  
            '${UsuarioPost.apellido}', 
            '${UsuarioPost.usuario}',
            '${UsuarioPost.cedula}', 
            '${UsuarioPost.email}', 
            '${UsuarioPost.telefono}', 
            '${UsuarioPost.foto}', 
            '${UsuarioPost.descripcion}',
            '${UsuarioPost.fechaCreacion}',
            '${UsuarioPost.intereses}',   
            '${UsuarioPost.contrasena}',)
            RETURNING id;`);
            const id = res.rows[0].id;
            if (res.rows.length === 0) {
                reply.code(404).send({ message: "usuario no creado" });
                return;
            }
            reply.code(201).send({ ...UsuarioPost, id });
        }
    });

    // Ruta para eliminar un usuario
    fastify.delete("/:id", {
        schema: {
            tags: ["Usuario"],
            description: "Elimina un usuario por ID",
            params: UsuarioIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        id: { type: "string" }
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
            const { id } = request.params as { id: string };
            const res = await query(`DELETE FROM usuarios WHERE id = ${id};`);
            if (res.rowCount === 0) {
                reply.code(404).send({ message: "Usuario no encontrado" });
                return;
            }
            reply.code(200).send({ message: "Usuario eliminado", id });
        }
    });

    // Ruta para editar un Usuario
    fastify.put("/:id", {
        schema: {
            tags: ["Usuario"],
            description: "Actualiza una usuario por ID",
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
                        intereses: { type: "array", items: { type: "string" } },
                        contrasena: { type: "string" },
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
            const { id } = request.params as { id: string };
            const usuarioPut = request.body as UsuarioPutType;
            const res = await query(`UPDATE usuarios
        SET telefono = '${usuarioPut.telefono}',
        foto = '${usuarioPut.foto}',
        descripcion = '${usuarioPut.descripcion}',
        intereses = '${usuarioPut.intereses}',
        contrasena = '${usuarioPut.contrasena}',
        usuario = '${usuarioPut.usuario}',
        WHERE id = ${id}
        RETURNING id;`);
            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Usuario no encontrado" });
                return;
            }
            reply.code(200).send({ ...usuarioPut, id });
        }
    });

    // Ruta para ver los datos de un Usuario específico
    fastify.get("/:id", {
        schema: {
            tags: ["Usuario"],
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
                        isAdmin: { type: "boolean" },
                        descripcion: { type: "string" },
                        intereses: { type: "array", items: { type: "string" } },
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
            const { id } = request.params as { id: string };
            const res = await query(`SELECT 
        id,
        nombre,
        apellido,
        usuario,
        cedula,
        email:,
        telefono,
        foto,
        isAdmin,
        descripcion,
        fechaCreacion,
        intereses,
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
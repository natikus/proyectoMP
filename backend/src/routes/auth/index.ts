import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { UsuarioIdSchema, usuarioLoginSchema, UsuarioPostSchema, UsuarioPostType, UsuarioSchema } from "../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from 'bcrypt';
import { Type } from "@sinclair/typebox";

const usuarioLoginRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {

    // Ruta para login
    fastify.post("/login", {
        schema: {
            description: "Ruta para loguearse usando email y contraseña.",
            summary: "Hacer login",
            security: [],
            body: {
                type: "object",
                properties: {
                    email: { type: "string" },
                    contrasena: { type: "string" },
                },
                required: ["email", "contrasena"],
            },
            tags: ["auth"],
            response: {
                200: {
                    description: "Datos del usuario y token JWT",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                token: Type.String({ description: "JWT generado" }),
                                id: Type.Number({ description: "ID del usuario" })
                            })
                        }
                    },
                },
                401: {
                    description: "Credenciales inválidas",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                message: Type.String(),
                            })
                        }
                    },
                },
            },
        },
        handler: async (request, reply) => {
            const { email, contrasena } = request.body as { email: string, contrasena: string };

            try {
                const res = await query("SELECT id, contrasena, nombre, apellido FROM usuarios WHERE email = $1", [email]);
                if (res.rows.length === 0) {
                    return reply.code(401).send({ message: "Usuario no encontrado" });
                }

                const { id, contrasena: hashedPassword } = res.rows[0];
                const isPasswordValid = await bcrypt.compare(contrasena, hashedPassword);

                if (!isPasswordValid) {
                    return reply.code(401).send({ message: "Contraseña incorrecta" });
                }

                // Generar token JWT
                const token = fastify.jwt.sign({ id, email });

                // Responder con el token
                reply.code(200).send({ token, id });
            } catch (error) {
                console.error("Error en el login:", error);
                reply.code(500).send({ message: "Error en el servidor" });
            }
        },
    });

    // Ruta para crear un usuario
    fastify.post("/", {
        schema: {
            summary: "Crear usuario",
            body: UsuarioPostSchema,
            tags: ["auth"],
            security: [],
            description: "Ruta para crear un nuevo usuario",
            response: {
                201: {
                    description: "Usuario creado exitosamente",
                    content: {
                        "application/json": {
                            schema: Type.Object({
                                id: UsuarioIdSchema.properties.id,
                                usuario: Type.String(),
                                email: Type.String(),
                                nombre: Type.String(),
                                apellido: Type.String(),
                                telefono: Type.String(),
                                foto: Type.String(),
                                intereses: Type.Array(Type.String()),
                            }),
                        },
                    },
                },
                400: {
                    description: "Error en la solicitud",
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
        handler: async function (request, reply) {
            const UsuarioPost = request.body as UsuarioPostType;
            const hashedPassword = await bcrypt.hash(UsuarioPost.contrasena, 10);

            try {
                const res = await query(`
                    INSERT INTO usuarios
                    (nombre, apellido, usuario, cedula, email, telefono, foto, is_Admin, descripcion, fechaCreacion, intereses, contrasena)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10, $11)
                    RETURNING id;
                `, [
                    UsuarioPost.nombre,
                    UsuarioPost.apellido,
                    UsuarioPost.usuario,
                    UsuarioPost.cedula,
                    UsuarioPost.email,
                    UsuarioPost.telefono,
                    UsuarioPost.foto,
                    UsuarioPost.is_Admin,
                    UsuarioPost.descripcion,
                    UsuarioPost.intereses,
                    hashedPassword
                ]);

                if (res.rows.length === 0) {
                    return reply.code(400).send({ message: "Usuario no creado" });
                }

                const id = res.rows[0].id;
                reply.code(201).send({
                    id,
                    ...UsuarioPost,
                    contrasena: undefined // No enviar la contraseña en la respuesta
                });
            } catch (error) {
                console.error("Error al crear el usuario:", error);
                reply.code(500).send({ message: "Error en el servidor" });
            }
        },
    });
};

export default usuarioLoginRoute;

import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { UsuarioPostSchema, UsuarioPostType } from "../../tipos/usuario.js";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from 'bcrypt';
const usuarioLoginRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {
    fastify.post("/login", {
        schema: {
            body: {
                type: "object",
                properties: {
                    email: { type: "string" },
                    contrasena: { type: "string" },
                },
                required: ["email", "contrasena"],
            },
            tags: ["auth"],
            description: "Login de usuario para obtener token JWT",
        },
        handler: async (request, reply) => {
            // Tipar el cuerpo de la solicitud correctamente
            const { email, contrasena: contrasena } = request.body as { email: string, contrasena: string };

            try {
                // Verificar si el usuario existe
                const res = await query("SELECT id, contrasena FROM usuarios WHERE email = $1", [email]);
                if (res.rows.length === 0) {
                    return reply.code(401).send({ message: "Usuario no encontrado" });
                }

                const { id, contrasena: hashedPassword, nombre, apellido } = res.rows[0];

                // Verificar la contraseña
                const isPasswordValid = await bcrypt.compare(contrasena, hashedPassword);
                if (!isPasswordValid) {
                    return reply.code(401).send({ message: "Contraseña incorrecta" });
                }

                // Generar token JWT
                const token = fastify.jwt.sign({ id, email });

                // Responder con el token
                reply.code(200).send({ token, id, user: { nombre, apellido, email } }); // Aquí incluyes lo que necesitas
            } catch (error) {
                console.error("Error en el login:", error);
                reply.code(500).send({ message: "Error en el servidor" });
            }
        },
    });
    fastify.post("/", {
        schema: {
            body: UsuarioPostSchema,  // Cambiado de 'params' a 'body'
            tags: ["Usuario"],
            description: "Crea un nuevo usuario",
        },
        // Si no quieres que se requiera autenticación para crear usuarios, elimina esta línea
        // preHandler: [fastify.authenticate], 
        handler: async function (request, reply) {
            const UsuarioPost = request.body as UsuarioPostType;

            // Encripta la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(UsuarioPost.contrasena, 10);

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
                hashedPassword // Guarda la contraseña encriptada
            ]);

            if (res.rows.length === 0) {
                return reply.code(404).send({ message: "Usuario no creado" });
            }

            const id = res.rows[0].id;
            reply.code(201).send({ ...UsuarioPost, id });
        }
    });


};

export default usuarioLoginRoute;
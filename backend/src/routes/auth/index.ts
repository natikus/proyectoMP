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
                    password: { type: "string" },
                },
                required: ["email", "password"],
            },
            tags: ["persona"],
            description: "Login de usuario para obtener token JWT",
        },
        handler: async (request, reply) => {
            // Tipar el cuerpo de la solicitud correctamente
            const { email, password } = request.body as { email: string, password: string };

            try {
                // Verificar si el usuario existe
                const res = await query("SELECT id, contrasena FROM personas WHERE email = $1", [email]);
                if (res.rows.length === 0) {
                    return reply.code(401).send({ message: "Usuario no encontrado" });
                }

                const { id, contrasena: hashedPassword, nombre, apellido } = res.rows[0];

                // Verificar la contraseña
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
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
};

export default usuarioLoginRoute;
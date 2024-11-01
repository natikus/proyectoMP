import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
const usuariosRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todos los usuarios
  fastify.get("/", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Obtener todos los usuarios",
      description: "Retorna una lista de todos los usuarios registrados",
      response: {
        200: {
          type: "array",
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await query(`SELECT
        id_persona,
        usuario,
        nombre, 
        apellido,
        usuario,
        email,
        imagen,
        is_Admin,
        descripcion,
        fechaCreacion,
        intereses,
        telefono
        FROM usuarioVirtual`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay usuarios registrados" });
        return;
      }
      return res.rows;
    },
  });
};

export default usuariosRoute;

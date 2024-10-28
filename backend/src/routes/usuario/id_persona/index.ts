import {
  UsuarioIdSchema,
  UsuarioPutSchema,
  UsuarioPutType,
  UsuarioIdType,
  UsuarioSchema,
} from "../../../tipos/usuario.js";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../../services/database.js";
const usuarioRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para eliminar un usuario
  fastify.delete("/", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Eliminar un usuario",
      description: "Elimina un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: {
          UsuarioIdSchema,
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.verifySelfOrAdmin,
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: string };
      const resPublicaciones = await query(
        `DELETE FROM publicaciones WHERE id_creador = ${id_persona};`
      );
      const res = await query(
        `DELETE FROM usuarioVirtual WHERE id_persona = ${id_persona};`
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Usuario no encontrado" });
        return;
      }
      reply
        .code(200)
        .send({ message: "Usuario eliminado", id_persona, resPublicaciones });
    },
  });
  // Ruta para editar un Usuario
  fastify.put("/", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Editar un usuario",
      description: "Actualiza un usuario por ID",
      params: UsuarioIdSchema,
      body: UsuarioPutSchema,
      response: {
        200: {
          UsuarioPutSchema,
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.verifySelfOrAdmin,
    handler: async function (request, reply) {
      const { id_persona } = request.params as UsuarioIdType;
      const usuarioPut = request.body as UsuarioPutType;
      const userIdFromToken = request.user.id_persona;
      if (userIdFromToken !== id_persona) {
        return reply
          .code(403)
          .send({ message: "No tienes permiso para modificar este usuario" });
      }
      const res = await query(
        `UPDATE usuarioVirtual
              SET usuario = COALESCE($1, usuario),
                  imagen = COALESCE($2, imagen),
                  descripcion = COALESCE($3, descripcion),
                  intereses = COALESCE($4, intereses),
                  contrasena = COALESCE($5, contrasena)
              WHERE id_persona = $7
              RETURNING id_persona;`,
        [
          usuarioPut.usuario,
          //
          //usuarioPut.descripcion,
          usuarioPut.intereses,
          usuarioPut.contrasena,
          id_persona,
        ]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      reply.code(200).send({ ...usuarioPut, id_persona });
    },
  });
  fastify.get("/", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Obtener un usuario específico",
      description: "Obtiene los detalles de un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: {
          UsuarioSchema,
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
      const { id_persona } = request.params as { id_persona: string };
      const res = await query(`SELECT 
          id_persona,
          nombre,
          apellido,
          usuario,
          email,
          imagen,
          is_Admin,
          descripcion,
          fechaCreacion,
          intereses
          FROM usuarioVirtual WHERE id_persona = ${id_persona};`);

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Usuario no encontrado" });
        return;
      }
      const usuario = res.rows[0];
      return usuario;
    },
  });
};

export default usuarioRoute;

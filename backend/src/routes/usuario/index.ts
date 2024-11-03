import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import {
  UsuarioIdSchema,
  UsuarioIdType,
  UsuarioPutSchema,
  UsuarioPutType,
  UsuarioSchema,
} from "../../tipos/usuario.js";
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
  fastify.get("/:id_persona", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Obtener un usuario específico",
      description: "Obtiene los detalles de un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: UsuarioSchema,
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
      const res = await query(
        `
        SELECT id_persona, nombre, apellido, usuario, email, imagen, 
               is_Admin, descripcion, fechaCreacion, intereses, telefono 
        FROM usuarioVirtual WHERE id_persona = $1;`,
        [id_persona]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      return res.rows[0];
    },
  });

  // Ruta para eliminar un usuario
  fastify.delete("/:id_persona", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Eliminar un usuario",
      description: "Elimina un usuario por ID",
      params: UsuarioIdSchema,
      response: {
        200: UsuarioIdSchema,
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
      await query(`DELETE FROM publicaciones WHERE id_creador = $1;`, [
        id_persona,
      ]);
      const res = await query(
        `DELETE FROM usuarioVirtual WHERE id_persona = $1;`,
        [id_persona]
      );

      if (res.rowCount === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      reply.code(200).send({ message: "Usuario eliminado", id_persona });
    },
  });

  // Ruta para editar un Usuario
  fastify.put("/:id_persona", {
    schema: {
      tags: ["usuarioVirtual"],
      summary: "Editar un usuario",
      description: "Actualiza un usuario por ID",
      params: UsuarioIdSchema,
      body: UsuarioPutSchema,
      response: {
        200: UsuarioPutSchema,
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
        `
        UPDATE usuarioVirtual
        SET usuario = COALESCE($1, usuario),
            imagen = COALESCE($2, imagen),
            descripcion = COALESCE($3, descripcion),
            intereses = COALESCE($4, intereses),
            contrasena = COALESCE($5, contrasena),
            telefono = COALESCE($6, telefono)
        WHERE id_persona = $7
        RETURNING id_persona;`,
        [
          usuarioPut.usuario,
          usuarioPut.imagen,
          usuarioPut.descripcion,
          usuarioPut.intereses,
          usuarioPut.contrasena,
          usuarioPut.telefono,
          id_persona,
        ]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      reply.code(200).send({ ...usuarioPut, id_persona });
    },
  });
};

export default usuariosRoute;

import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import {
  amigoPostSchema,
  amigoPostType,
  UsuarioIdSchema,
  UsuarioIdType,
  UsuarioPutSchema,
  UsuarioPutType,
  UsuarioSchema,
} from "../../tipos/usuario.js";
import { publicacionSchema } from "../../tipos/publicacion.js";
import bcrypt from "bcrypt";
import path from "path";
import { writeFileSync } from "fs";
import { promisify } from "util";
import fs from "fs";
const usuariosRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todos los usuarios
  fastify.get("/", {
    schema: {
      tags: ["usuarios"],
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
        
        nombre, 
        apellido,
        usuario,
        email,
        imagen,
        is_Admin,
        descripcion,
        intereses,
        telefono
        FROM usuarios`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay usuarios registrados" });
        return;
      }
      return res.rows;
    },
  });
  fastify.get("/:id_persona", {
    schema: {
      tags: ["usuarios"],
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
               is_Admin, descripcion, intereses, telefono 
        FROM usuarios WHERE id_persona = $1;`,
        [id_persona]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      return res.rows[0];
    },
  });
  fastify.post("/:id_persona/amigo", {
    schema: {
      summary: "Agregar un amigo",
      description: "Crea una nueva etiqueta.",
      tags: ["amigos"],
      body: amigoPostSchema,
      response: {
        201: {
          description: "Amigo añadido con éxito.",
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_amigo1, id_amigo2 } = request.body as amigoPostType;
      const res = await query(
        `INSERT INTO amigos (id_amigo1, id_amigo2) VALUES ($1, $2) RETURNING *;`,
        [id_amigo1, id_amigo2]
      );
      reply.code(201).send(res.rows[0]);
    },
  });
  // Ruta para eliminar un usuario
  fastify.delete("/:id_persona", {
    schema: {
      tags: ["usuarios"],
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
      const res = await query(`DELETE FROM usuarios WHERE id_persona = $1;`, [
        id_persona,
      ]);

      if (res.rowCount === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      reply.code(200).send({ message: "Usuario eliminado", id_persona });
    },
  });

  fastify.put("/:id_persona", {
    schema: {
      tags: ["usuarios"],
      summary: "Editar un usuario",
      description: "Actualiza un usuario por ID",
      consumes: ["multipart/form-data"],
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
      console.log("Params recibidos:", request.params);

      const { id_persona } = request.params as UsuarioIdType;
      const usuarioPut = request.body as UsuarioPutType;
      const userIdFromToken = request.user.id_persona;
      console.log("Cuerpo recibido (raw):", request.body);

      if (userIdFromToken != id_persona) {
        return reply
          .code(403)
          .send({ message: "No tienes permiso para modificar este usuario" });
      }
      const currentImageResult = await query(
        `SELECT imagen FROM usuarios WHERE id_persona = $1`,
        [id_persona]
      );
      let currentImageUrl = currentImageResult.rows[0]?.imagen;
      let imageUrl = "";
      const unlinkAsync = promisify(fs.unlink);
      if (usuarioPut.imagen) {
        if (currentImageUrl) {
          const currentImagePath = path.join(process.cwd(), currentImageUrl);
          try {
            await unlinkAsync(currentImagePath);
            console.log("Imagen anterior eliminada:", currentImagePath);
          } catch (error) {
            console.error("Error al eliminar la imagen anterior:", error);
          }
        }

        // Procesar la imagen si existe en la solicitud
        const fileBuffer = usuarioPut.imagen._buf as Buffer;
        const filepath = path.join(
          process.cwd(),
          "uploads",
          usuarioPut.imagen.filename
        );
        writeFileSync(filepath, fileBuffer);
        imageUrl = `/uploads/${usuarioPut.imagen.filename}`;
      }

      // Opcionalmente, encriptar la contraseña si se proporciona una nueva
      const hashedPassword = usuarioPut.contrasena
        ? await bcrypt.hash(usuarioPut.contrasena, 10)
        : undefined;

      let intereses: string[];
      try {
        intereses = JSON.parse(usuarioPut.intereses.value);
      } catch (e) {
        reply.code(400).send({ message: "Formato de intereses inválido" });
        return;
      }

      const res = await query(
        `
        UPDATE usuarios
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
          imageUrl || null,
          usuarioPut.descripcion,
          intereses,
          hashedPassword,
          usuarioPut.telefono,
          id_persona,
        ]
      );

      if (res.rows.length === 0) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }

      reply.code(200).send({
        id_persona,
        usuario: usuarioPut.usuario,
        descripcion: usuarioPut.descripcion,
        intereses,
        telefono: usuarioPut.telefono,
        imagen: imageUrl,
      });
    },
  });

  fastify.get("/:id_persona/publicaciones", {
    schema: {
      summary: "Obtener las publicaciones de una persona especifica",
      description:
        "Obtiene la publicación correspondiente al usuario con ID especificado.",
      tags: ["publicacion"],
      response: {
        200: {
          description: "Publicación encontrada",
          type: "object",
          properties: publicacionSchema.properties,
        },
        404: {
          description: "Publicación no encontrada",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: number };

      const res = await query(
        `
            SELECT
              id_publicacion,
              titulo,
              estado,
              id_creador,
              descripcion,
              imagenes,
              ubicacion
            FROM publicaciones WHERE id_creador = $1;`,
        [id_persona]
      );
      if (res.rows.length === 0) {
        reply.code(404).send({
          message: "publicación no encontrada o no tiene publicaciones aún",
        });
        return;
      }
      return res.rows[0];
    },
  });
};

export default usuariosRoute;

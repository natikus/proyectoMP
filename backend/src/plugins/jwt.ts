import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { FastifyReply } from "fastify/types/reply.js";
import { UsuarioIdType } from "./../tipos/usuario.js";
import { publicacionIdType, publicacionType } from "./../tipos/publicacion.js";

const jwtOptions: FastifyJWTOptions = {
  secret: "MYSUPERSECRET",
};

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, jwtOptions);
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        console.log("Verificando autenticación..."); // Agregar log
        await request.jwtVerify();
        console.log("Usuario autenticado: ", request.user); // Agregar log
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
      }
    }
  );

  fastify.decorate(
    "verifySelfOrAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        console.log("ESOY");
        try {
          console.log("VERIFICANDO QUE SOS VOS");
          await request.jwtVerify();
        } catch {
          console.log("NO ANDAAAA");
        }

        const user = request.user; // El usuario debería estar definido después de jwtVerify
        console.log(user, "SOY EL USUARIO VIENDOOO");
        if (!user) {
          console.log("USUARIO NO VALIDO");
          throw new Error("No se encontró el usuario en el token");
        }
        console.log("USUARIO CALIDO!!!");

        // Verificar si el usuario es el mismo o tiene privilegios de administrador
        console.log("PARAMETROSSSS", request.params);
        const { id_persona } = request.params as UsuarioIdType;
        if (user.id_persona != id_persona && !user.is_Admin) {
          console.log("SOY EL USUARIO PERO NO ESE");
          return reply.code(403).send({
            message: "No tienes permisos para realizar esta acción",
          });
        }

        // Si pasa las validaciones, continuar
      } catch (err) {
        console.error("Error en verifySelfOrAdmin:", err);
        return reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );
});

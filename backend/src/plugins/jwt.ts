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
    //verifica si la persona que hizo la solicitud es admin o el creador
    "verifySelfOrAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      console.log("Verificando si es administrador o self.");
      const usuarioToken = request.user;
      const id_usuario = Number((request.params as UsuarioIdType).id_persona);
      console.log({ usuarioToken, id_usuario });
      if (!usuarioToken.is_Admin && usuarioToken.id_persona !== id_usuario)
        throw reply.unauthorized(
          "No estás autorizado a modificar ese recurso que no te pertenece si no eres admin."
        );
    }
  );
});

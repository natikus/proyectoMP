import { FastifyReply, FastifyRequest } from "fastify";
import { UsuarioType } from "./usuario.js";
export interface AuthenticateFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: AuthenticateFunction;
    verifySelfOrAdmin: AuthenticateFunction;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: UsuarioType;
    user: UsuarioType;
  }
}
export default AuthenticateFunction;

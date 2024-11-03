import { FastifyReply, FastifyRequest } from "fastify";
import { UsuarioType } from "./usuario.js";
import fastify from "fastify";
export interface AuthenticateFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
const server = fastify({
  bodyLimit: 10485760, // 10 MB
});
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

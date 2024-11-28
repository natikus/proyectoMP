import { FastifyReply, FastifyRequest } from "fastify";
import { UsuarioType } from "./usuario.js";
import fastify from "fastify";
export interface AuthenticateFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
const server = fastify({
  bodyLimit: 10 * 1024 * 1024, // 10 MB
});
declare module "fastify" {
  interface FastifyInstance {
    authenticate: AuthenticateFunction;
    verifySelfOrAdmin: AuthenticateFunction;
    googleOAuth2: any;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id_persona: string; email: string };
    user: UsuarioType;
  }
}
export default AuthenticateFunction;

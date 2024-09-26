import { FastifyReply, FastifyRequest } from "fastify";

export interface AuthenticateFunction {
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: AuthenticateFunction;
        verifyUserId: AuthenticateFunction;
    }
}

export default AuthenticateFunction;
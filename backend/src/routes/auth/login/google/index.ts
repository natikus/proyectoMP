import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import type { AppOptions } from "./../../../../app.ts";
import { query } from "./../../../../services/database.js";

const googleRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: AppOptions
): Promise<void> => {
  fastify.get(
    "/callback",
    {
      schema: {
        tags: ["auth"],
        summary: "Google OAuth2 Callback",
        description:
          "Ruta para manejar el callback de autenticación de Google OAuth2.",
        params: {
          type: "object",
          properties: {},
        },
        response: {
          302: {
            description:
              "Redirección exitosa con el token JWT o registro de usuario.",
            type: "object",
            properties: {
              token: { type: "string" },
              user: { type: "object" },
            },
          },
          500: {
            description: "Error durante el proceso de autenticación.",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      console.log("Obteniendo token");
      try {
        // Obtiene el token de Google OAuth2
        const googletoken =
          await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );

        console.log({ googletoken });

        const userinfo = await fastify.googleOAuth2.userinfo(
          googletoken.token.access_token
        );

        // Convertir la respuesta en un string y luego en un objeto para manejar los datos
        const parsedUserinfo = JSON.parse(JSON.stringify(userinfo));

        const email = parsedUserinfo.email;
        const given_name = parsedUserinfo.given_name;
        const family_name = parsedUserinfo.family_name;
        console.log("Se obtuvieron los datos", email, given_name, family_name);

        // Verifica si el correo electrónico existe en la base de datos
        const res = await query(
          `SELECT id_persona, email FROM usuarios WHERE email = '${email}'`
        );

        // En caso de que la persona no exista en la base de datos, se pasan los datos en la URL
        if (res.rows.length === 0) {
          reply.redirect(
            `https://localhost/auth/registro?email=${email}&given_name=${given_name}&family_name=${family_name}`
          );
          return;
        }

        const user = res.rows[0];
        const token = fastify.jwt.sign({
          id_persona: user.id,
          email: user.email,
        });
        reply.redirect(
          `https://localhost/inicio?token=${token}&user=${user.id}`
        );
      } catch (error) {
        console.error("Error al obtener el token de acceso:", error);
        reply.status(500).send({ error: "Error al procesar la autenticación" });
      }
    }
  );
};

export default googleRoutes;

import swagger, { SwaggerOptions } from "@fastify/swagger";
import fp from "fastify-plugin";
import swaggerUI from "@fastify/swagger-ui";

const options: SwaggerOptions = {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "",
      description: "Descripcion de la aplicacion Mutual Purpose (MP)",
      version: "0.1.0",
    },
    servers: [
      {
        url: "https://localhost/backend",
        description: "Development server",
      },
    ],
    tags: [
      { name: "usuarios", description: "Datos de usuario" },
      { name: "auth", description: "Ingreso del usuario a la aplicacion" },
      { name: "publicacion", description: "Publicaciones de la aplicacion" },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
};

export default fp<SwaggerOptions>(async (fastify) => {
  fastify.register(swagger, options);
  await fastify.register(swaggerUI, {
    routePrefix: "docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});

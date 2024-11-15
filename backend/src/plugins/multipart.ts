import fp from "fastify-plugin";
import multipart from "@fastify/multipart";

export default fp(async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 200, // Tamaño máximo del nombre de un campo (bytes)
      fieldSize: 1000000, // Tamaño máximo de un campo (bytes)
      fields: 20, // Número máximo de campos no relacionados con archivos
      fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo (10 MB)
      files: 10, // Número máximo de archivos
      parts: 100, // Número máximo de partes (campos + archivos)
    },
    attachFieldsToBody: true,
    sharedSchemaId: "#multiPartSchema",
  });
});

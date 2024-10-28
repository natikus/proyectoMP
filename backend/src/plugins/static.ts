import { join } from 'path';
import { FastifyPluginAsync } from 'fastify';
import fastifyStatic from '@fastify/static';

const staticPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(fastifyStatic, {
        root: join(process.cwd(), 'uploads'), // Carpeta 'uploads' desde la raíz del proyecto
        prefix: '/uploads/', // Prefijo que usarás para las imágenes
    });
};

export default staticPlugin;

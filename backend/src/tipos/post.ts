import { Static, Type } from "@sinclair/typebox";

export const postSchema = Type.Object({//esquema utilizado para hacer un get
    id_post: Type.Number(),
    titulo: Type.String({ minLength: 2, maxLength: 100 }),
    estado: Type.String({ minLength: 2, maxLength: 100 }),
    id_creador: Type.Number(),
    descripcion: Type.String({ maxLength: 300 }),
    imagenes: Type.String(),
    ubicacion: Type.String(),
    fechaCreacion: Type.String({ format: 'date-time' }),
    etiquetas: Type.Array(Type.String()),
});
export const postPostSchema = Type.Object({//esquema utilizado para hacer un post
    titulo: Type.String({ minLength: 2, maxLength: 100 }),
    id_creador: Type.Number(),
    descripcion: Type.String({ maxLength: 300 }),
    imagenes: Type.String(),
    ubicacion: Type.String(),
    etiquetas: Type.Array(Type.String()),
});
export const postPutSchema = Type.Object({//esquema utilizado para hacer un put
    titulo: Type.Optional(Type.String({ minLength: 2, maxLength: 100 })),
    descripcion: Type.Optional(Type.String({ maxLength: 300 })),
    imagenes: Type.Optional(Type.String()),
    ubicacion: Type.Optional(Type.String()),
    etiquetas: Type.Optional(Type.Array(Type.String())),
});
export const postIdSchema = Type.Object({
    id_post: Type.Number(),
});

export type postIdType = Static<typeof postIdSchema>;
export type postPostType = Static<typeof postPostSchema>;
export type postPutType = Static<typeof postPutSchema>;
export type postType = Static<typeof postSchema>;
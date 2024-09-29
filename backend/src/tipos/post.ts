import { Static, Type } from "@sinclair/typebox";

export const postSchema = Type.Object({//esquema utilizado para hacer un get
    id_post: Type.Number(),
    titulo: Type.String({ minLength: 2, maxLength: 100 }),
    estado: Type.String({ minLength: 2, maxLength: 100 }),
    creador: Type.Object({
        id_usuario: Type.Integer({
            description: "Id del usuario que creó el post.",
        }),
        creador: Type.String({
            description: "username del usuario que creó el post.",
        }),
    }),
    descripcion: Type.String({ maxLength: 300 }),
    imagenes: Type.String(),
    ubicacion: Type.String(),
    fechaCreacion: Type.String({ format: 'date-time' }),
    etiquetas: Type.Array(Type.String()),
});
export const postPostSchema = Type.Object({//esquema utilizado para hacer un post
    titulo: Type.String({ minLength: 2, maxLength: 100 }),
    creador: Type.Object({
        id_usuario: Type.Integer({
            description: "Id del usuario que creó el post.",
        }),
    }),
    descripcion: Type.String({ maxLength: 300 }),
    imagenes: Type.String(),
    ubicacion: Type.String(),
    etiquetas: Type.Array(Type.String()),
});
export const postPutSchema = Type.Object({//esquema utilizado para hacer un put
    titulo: Type.String({ minLength: 2, maxLength: 100 }),
    descripcion: Type.String({ maxLength: 300 }),
    imagenes: Type.String(),
    ubicacion: Type.String(),
    etiquetas: Type.Array(Type.String()),
});
export const postIdSchema = Type.Object({
    id_post: Type.Number(),
});

export type postIdType = Static<typeof postIdSchema>;
export type postPostType = Static<typeof postPostSchema>;
export type postPutType = Static<typeof postPutSchema>;
export type postType = Static<typeof postSchema>;
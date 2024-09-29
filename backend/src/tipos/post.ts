import { Static, Type } from "@sinclair/typebox";

export const postSchema = Type.Object({//esquema utilizado para hacer un get
    id_post: Type.Number({ description: "Id para identificar el post" }),
    titulo: Type.String({ minLength: 2, maxLength: 100, description: "Título del post" }),
    estado: Type.String({ minLength: 2, maxLength: 100, description: "Estado del post" }),
    id_creador: Type.Number({ description: "Id del creador del post" }),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del post" }),
    imagenes: Type.String({ description: "Imágenes del post" }),
    ubicacion: Type.String({ description: "Ubicación del post" }),
    fechaCreacion: Type.String({ format: 'date-time', description: "Fecha de creación del post" }),
    etiquetas: Type.Array(Type.String(), {description: "Etiquetas del post"}),
});
export const postPostSchema = Type.Object({//esquema utilizado para hacer un post
    titulo: Type.String({ minLength: 2, maxLength: 100, description: "Título del post" }),
    id_creador: Type.Number({ description: "Id del creador del post" }),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del post" }),
    imagenes: Type.String({ description: "Imágenes del post" }),
    ubicacion: Type.String({ description: "Ubicación del post" }),
    etiquetas: Type.Array(Type.String(), {description: "Etiquetas del post"}),
});
export const postPutSchema = Type.Object({//esquema utilizado para hacer un put
    titulo: Type.Optional(Type.String({ minLength: 2, maxLength: 100, description: "Título del post" })),
    descripcion: Type.Optional(Type.String({ maxLength: 300, description: "Descripción del post" })),
    imagenes: Type.Optional(Type.String({description: "Imágenes del post"})),
    ubicacion: Type.Optional(Type.String({description: "Ubicación del post"})),
    etiquetas: Type.Optional(Type.Array(Type.String({description: "Etiquetas del post"})), ),
});
export const postIdSchema = Type.Object({
    id_post: Type.Number({ description: "Id para identificar el post" }),
});

export type postIdType = Static<typeof postIdSchema>;
export type postPostType = Static<typeof postPostSchema>;
export type postPutType = Static<typeof postPutSchema>;
export type postType = Static<typeof postSchema>;
import { Static, Type } from "@sinclair/typebox";

export const postSchema = Type.Object({//esquema utilizado para hacer un get
    id_post: Type.Number({ description: "Id para identificar el post" }),
    titulo: Type.String({ minLength: 2, maxLength: 100, description: "Título del post" }),
    estado: Type.Optional(Type.Boolean({description: "Estado del post"})),
    id_creador: Type.Number({ description: "Id del creador del post" }),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del post" }),
    imagenes: Type.String({ description: "Imágenes del post" }),
    ubicacion: Type.String({ description: "Ubicación del post" }),
    fechaCreacion: Type.String({ format: 'date-time', description: "Fecha de creación del post" }),
    etiquetas: Type.Array(Type.String(), {description: "Etiquetas del post"}),
},
{ 
    examples: [
        { id_post: 1, titulo: "Post 1", estado: true, id_creador: 1, descripcion: "Descripción del post 1", imagenes: "imagen1.jpg", ubicacion: "Ubicación del post 1", fechaCreacion: "2021-10-10T14:48:00.000Z", etiquetas: ["etiqueta1", "etiqueta2"] },
        { id_post: 2, titulo: "Post 2", estado: false, id_creador: 1, descripcion: "Descripción del post 2", imagenes: "imagen2.jpg", ubicacion: "Ubicación del post 2", fechaCreacion: "2021-10-10T14:48:00.000Z", etiquetas: ["etiqueta3", "etiqueta4"] },
    ],
}
);
export const postPostSchema = Type.Object({//esquema utilizado para hacer un post
    titulo: Type.String({ minLength: 2, maxLength: 100, description: "Título del post" }),
    id_creador: Type.Number({ description: "Id del creador del post" }),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del post" }),
    imagenes: Type.String({ description: "Imágenes del post" }),
    ubicacion: Type.String({ description: "Ubicación del post" }),
    etiquetas: Type.Array(Type.String(), {description: "Etiquetas del post"}),
},
{
    examples: [
        { titulo: "Post 1", id_creador: 1, descripcion: "Descripción del post 1", imagenes: "imagen1.jpg", ubicacion: "Ubicación del post 1", etiquetas: ["etiqueta1", "etiqueta2"] },
        { titulo: "Post 2", id_creador: 1, descripcion: "Descripción del post 2", imagenes: "imagen2.jpg", ubicacion: "Ubicación del post 2", etiquetas: ["etiqueta3", "etiqueta4"] },
    ]
}
);
export const postPutSchema = Type.Object({//esquema utilizado para hacer un put
    titulo: Type.Optional(Type.String({ minLength: 2, maxLength: 100, description: "Título del post" })),
    descripcion: Type.Optional(Type.String({ maxLength: 300, description: "Descripción del post" })),
    imagenes: Type.Optional(Type.String({description: "Imágenes del post"})),
    ubicacion: Type.Optional(Type.String({description: "Ubicación del post"})),
    etiquetas: Type.Optional(Type.Array(Type.String({description: "Etiquetas del post"})), ),
},
{
    examples: [
        { titulo: "Post 1", descripcion: "Descripción del post 1", imagenes: "imagen1.jpg", ubicacion: "Ubicación del post 1", etiquetas: ["etiqueta1", "etiqueta2"] },
        { titulo: "Post 2", descripcion: "Descripción del post 2", imagenes: "imagen2.jpg", ubicacion: "Ubicación del post 2", etiquetas: ["etiqueta3", "etiqueta4"] },
    ]
}
);
export const postIdSchema = Type.Object({
    id_post: Type.Number({ description: "Id para identificar el post" }),
},
{
    examples: [
        { id_post: 1 },
        { id_post: 2 },
    ]
}
);

export type postIdType = Static<typeof postIdSchema>;
export type postPostType = Static<typeof postPostSchema>;
export type postPutType = Static<typeof postPutSchema>;
export type postType = Static<typeof postSchema>;
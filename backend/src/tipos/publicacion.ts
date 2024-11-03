import { Static, Type } from "@sinclair/typebox";

export const publicacionSchema = Type.Object(
  {
    id_publicacion: Type.Number({
      description: "Id para identificar la publicacion",
    }),
    titulo: Type.String({
      minLength: 2,
      maxLength: 100,
      description: "Título de la publicacion",
    }),
    estado: Type.Optional(
      Type.Boolean({ description: "Estado de la publicacion" })
    ),
    id_creador: Type.Number({
      description: "Id del creador de la publicacion",
    }),
    descripcion: Type.String({
      maxLength: 300,
      description: "Descripción de la publicacion",
    }),
    imagenes: Type.Array(Type.String(), {
      description: "Imágenes de la publicacion",
    }),
    ubicacion: Type.String({ description: "Ubicación del objeto" }),
    fechaCreacion: Type.Optional(
      Type.String({
        format: "date-time",
        description: "Fecha de creación de la publicacion",
      })
    ),
  },
  {
    examples: [
      {
        id_publicacion: 1,
        titulo: "Post 1",
        estado: true,
        id_creador: 1,
        descripcion: "Descripción del post 1",
        imagenes: ["imagen1.jpg", "imagen2.jpg"],
        ubicacion: "Ubicación del post 1",
        fechaCreacion: "2021-10-10T14:48:00.000Z",
      },
      {
        id_publicacion: 2,
        titulo: "Post 2",
        estado: false,
        id_creador: 1,
        descripcion: "Descripción del post 2",
        imagenes: ["imagen3.jpg"],
        ubicacion: "Ubicación del post 2",
        fechaCreacion: "2021-10-10T14:48:00.000Z",
      },
    ],
  }
);

export const publicacionPostSchema = Type.Object(
  {
    titulo: Type.String({
      minLength: 2,
      maxLength: 100,
      description: "Título de la publicacion",
    }),
    id_creador: Type.Number({
      description: "Id del creador de la publicacion",
    }),
    descripcion: Type.String({
      maxLength: 300,
      description: "Descripción de la publicacion",
    }),
    imagenes: Type.Array(Type.String(), {
      description: "Imágenes de la publicacion",
    }),
    ubicacion: Type.String({ description: "Ubicación de la publicacion" }),
  },
  {
    examples: [
      {
        titulo: "Post 1",
        id_creador: 1,
        descripcion: "Descripción del post 1",
        imagenes: ["imagen1.jpg", "imagen2.jpg"],
        ubicacion: "Ubicación del post 1",
      },
      {
        titulo: "Post 2",
        id_creador: 1,
        descripcion: "Descripción del post 2",
        imagenes: ["imagen3.jpg"],
        ubicacion: "Ubicación del post 2",
      },
    ],
  }
);

export const publicacionPutSchema = Type.Object(
  {
    titulo: Type.Optional(
      Type.String({
        minLength: 2,
        maxLength: 100,
        description: "Título de la publicacion",
      })
    ),
    descripcion: Type.Optional(
      Type.String({
        maxLength: 300,
        description: "Descripción de la publicacion",
      })
    ),
    imagenes: Type.Optional(
      Type.Array(Type.String(), { description: "Imágenes de la publicacion" })
    ),
    ubicacion: Type.Optional(
      Type.String({ description: "Ubicación del objeto" })
    ),
  },
  {
    examples: [
      {
        titulo: "Post 1",
        descripcion: "Descripción del post 1",
        imagenes: ["imagen1.jpg", "imagen2.jpg"],
        ubicacion: "Ubicación del post 1",
      },
      {
        titulo: "Post 2",
        descripcion: "Descripción del post 2",
        imagenes: ["imagen3.jpg"],
        ubicacion: "Ubicación del post 2",
      },
    ],
  }
);

export const publicacionIdSchema = Type.Object(
  {
    id_publicacion: Type.Number({
      description: "Id para identificar la publicacion",
    }),
  },
  {
    examples: [{ id_publicacion: 1 }, { id_publicacion: 2 }],
  }
);

export type publicacionIdType = Static<typeof publicacionIdSchema>;
export type publicacionPostType = Static<typeof publicacionPostSchema>;
export type publicacionPutType = Static<typeof publicacionPutSchema>;
export type publicacionType = Static<typeof publicacionSchema>;

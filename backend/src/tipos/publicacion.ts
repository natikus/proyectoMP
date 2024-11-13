import { Static, Type } from "@sinclair/typebox";
import { FileSchema, numberSchema, stringSchema } from "./esqyemasFeos.js";

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
    imagenes: Type.String({
      description: "Imágenes de la publicacion",
    }),
    ubicacion: Type.String({ description: "Ubicación del objeto" }),
  },
  {
    examples: [
      {
        id_publicacion: 1,
        titulo: "Post 1",
        estado: true,
        id_creador: 1,
        descripcion: "Descripción del post 1",
        imagenes: "imagen1.jpg",
        ubicacion: "Ubicación del post 1",
      },
      {
        id_publicacion: 2,
        titulo: "Post 2",
        estado: false,
        id_creador: 1,
        descripcion: "Descripción del post 2",
        imagenes: "imagen3.jpg",
        ubicacion: "Ubicación del post 2",
      },
    ],
  }
);

export const publicacionPostSchema = Type.Object({
  titulo: stringSchema,
  id_creador: numberSchema,
  descripcion: stringSchema,
  imagenes: FileSchema,
  ubicacion: stringSchema,
});

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
      Type.String({ description: "Imágenes de la publicacion" })
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
        imagenes: "imagen1.jpg",
        ubicacion: "Ubicación del post 1",
      },
      {
        titulo: "Post 2",
        descripcion: "Descripción del post 2",
        imagenes: "imagen3.jpg",
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

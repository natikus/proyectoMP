import { Static, Type } from "@sinclair/typebox";

export const etiquetaSchema = Type.Object(
  {
    id_publicacion: Type.Number({
      description: "Id de la publicación que se relaciona con la etiqueta",
    }),
    id_etiqueta: Type.Number({
      description: "Id de la etiqueta asociada a la publicación",
    }),
  },
  {
    examples: [
      {
        id_publicacion: 1,
        id_etiqueta: 2,
      },
      {
        id_publicacion: 3,
        id_etiqueta: 4,
      },
    ],
  }
);
export const etiquetaIdSchema = Type.Object({
  id_etiqueta: Type.Number({
    description: "Identificador único de la etiqueta",
  }),
});

export type etiquetaSchemaType = Static<typeof etiquetaSchema>;
export type etiquetaIdSchemaType = Static<typeof etiquetaIdSchema>;

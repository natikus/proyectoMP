import { Static, Type } from "@sinclair/typebox";
import { stringSchema } from "./esqyemasFeos.js";

export const comunidadSchema = Type.Object(
  {
    id_comunidad: Type.Number({
      description: "Id de la publicación que se relaciona con la comunidad",
    }),
    comunidad: Type.String({
      description: "Id de la comunidad asociada a la publicación",
    }),
  },
  {
    examples: [
      {
        id_comunidad: 1,
        comunidad: "gatos",
      },
      {
        id_comunidad: 3,
        comunidad: "perros",
      },
    ],
  }
);
export const comunidadPostSchema = Type.Object(
  {
    comunidad: stringSchema,
  },
  {
    examples: [
      {
        comunidad: "gatos",
      },
      {
        comunidad: "perros",
      },
    ],
  }
);
export const comunidadIdSchema = Type.Object({
  id_comunidad: Type.Number({
    description: "Identificador único de la comunidad",
  }),
});

export type comunidadPostSchemaType = Static<typeof comunidadPostSchema>;
export type comunidadSchemaType = Static<typeof comunidadSchema>;
export type comunidadIdSchemaType = Static<typeof comunidadIdSchema>;

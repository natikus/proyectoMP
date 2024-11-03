import { Type } from "@sinclair/typebox";
export const FileSchema = Type.Object(
  {
    type: Type.Literal("file", {
      description: "Tipo de campo, en este caso es un archivo",
    }),
    fieldname: Type.String({
      description: "Nombre del campo donde se sube el archivo",
    }),
    filename: Type.String({ description: "Nombre del archivo subido" }),
    encoding: Type.String({ description: "Tipo de codificación del archivo" }),
    mimetype: Type.String({ description: "Tipo MIME del archivo" }),
    file: Type.Object(
      {},
      { description: "Objeto que representa el archivo subido" }
    ),
    _buf: Type.Object(
      {},
      { description: "Buffer temporal del archivo subido" }
    ),
  },
  { additionalProperties: false }
);

export const stringSchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de formulario",
    }),
    fieldname: Type.String({ description: "Nombre del campo del formulario" }),
    mimetype: Type.String({ description: "Tipo MIME del campo" }),
    encoding: Type.String({ description: "Codificación del campo" }),
    value: Type.String({ description: "Valor del campo del formulario" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);
export const numberSchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de formulario",
    }),
    fieldname: Type.String({ description: "Nombre del campo del formulario" }),
    mimetype: Type.String({ description: "Tipo MIME del campo" }),
    encoding: Type.String({ description: "Codificación del campo" }),
    value: Type.Number({ description: "Valor del campo del formulario" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);
export const stringArraySchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de formulario",
    }),
    fieldname: Type.String({ description: "Nombre del campo del formulario" }),
    mimetype: Type.Array(Type.String(), { description: "Tipo MIME del campo" }),
    encoding: Type.String({ description: "Codificación del campo" }),
    value: Type.String({ description: "Valor del campo del formulario" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);

export const emailSchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de email",
    }),
    fieldname: Type.String({
      description: "Nombre del campo del formulario de email",
    }),
    mimetype: Type.String({ description: "Tipo MIME del campo de email" }),
    encoding: Type.String({ description: "Codificación del campo de email" }),
    value: Type.String({ description: "Valor del campo de email" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);

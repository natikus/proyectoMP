import { Static, Type } from "@sinclair/typebox";
import {
  contrasenaSchema,
  descripcionSchema,
  emailSchema,
  FileSchema,
  nombreSchema,
  stringArraySchema,
  stringSchema,
  telefonoSchema,
} from "./esqyemasFeos.js";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,20}$/;

export const UsuarioSchema = Type.Object(
  {
    //esquema utilizado para hacer un get
    id_persona: Type.Number({ description: "Id para identificar el usuario" }),
    nombre: Type.String({
      minLength: 2,
      maxLength: 50,
      descriptio: "Nombre del usuario",
    }),
    apellido: Type.String({
      minLength: 2,
      maxLength: 50,
      description: "Apellido del usuario",
    }),
    usuario: Type.String({
      minLength: 2,
      maxLength: 50,
      description: "Nombre de usuario",
    }),
    email: Type.String({
      type: "string",
      format: "email",
      description: "Correo electrónico del usuario",
    }),
    imagen: Type.String({ description: "Foto del usuario" }),
    is_Admin: Type.Optional(
      Type.Boolean({ description: "Indica si el usuario es administrador" })
    ),
    descripcion: Type.String({
      maxLength: 300,
      description: "Descripción del usuario",
    }),

    intereses: Type.Array(Type.String(), {
      description: "Intereses del usuario",
    }),
    telefono: Type.String({
      maxLength: 300,
      description: "telefono del usuario",
    }),
  },
  {
    examples: [
      {
        id_persona: 1,
        nombre: "Usuario 1",
        apellido: "Apellido 1",
        usuario: "usuario1",
        email: "example1@example.com",
        imagen: "foto1.jpg",
        is_Admin: true,
        descripcion: "Descripción del usuario 1",
        intereses: ["interes1", "interes2"],
        telefono: "123456789",
      },
      {
        id_persona: 2,
        nombre: "Usuario 2",
        apellido: "Apellido 2",
        usuario: "usuario2",
        email: "example2@example.com",
        imagen: "foto2.jpg",
        is_Admin: false,
        descripcion: "Descripción del usuario 2",
        intereses: ["interes3", "interes4"],
        telefono: "234567890",
      },
    ],
  }
);
export const UsuarioPutSchema = Type.Object(
  {
    usuario: stringSchema,
    imagen: FileSchema,
    intereses: stringArraySchema,
    contrasena: contrasenaSchema,
    telefono: telefonoSchema,
    descripcion: descripcionSchema,
  },
  {
    examples: [
      {
        usuario: {
          type: "field",
          fieldname: "usuario",
          mimetype: "text/plain",
          encoding: "7bit",
          value: "usuario1",
          fieldnameTruncated: false,
          valueTruncated: false,
        },
        imagen: {
          type: "file",
          fieldname: "imagen",
          filename: "foto1.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          file: {},
          _buf: {},
        },
        descripcion: ["Holaaa"],
        intereses: ["interes3", "interes4"],
        contrasena: "Contrasena1",
        telefono: "234567890",
      },
    ],
  }
);

export const UsuarioIdSchema = Type.Object(
  {
    id_persona: Type.Number({ description: "Id para identificar el usuario" }),
  },
  {
    examples: [{ id: 1 }, { id: 2 }],
  }
);

export const UsuarioLoginSchema = Type.Object({
  contrasena: Type.String({
    minLength: 8,
    maxLength: 20,
    description: "Contraseña del usuario",
  }),
  email: Type.String({
    type: "string",
    format: "email",
    description: "Correo electrónico del usuario",
  }),
});

export const UsuarioPostSchema = Type.Object({
  nombre: nombreSchema,
  apellido: nombreSchema,
  usuario: stringSchema,
  email: emailSchema,
  imagen: FileSchema,
  descripcion: descripcionSchema,
  intereses: stringArraySchema,
  contrasena: contrasenaSchema,
  telefono: telefonoSchema,
});

export type UsuarioIdType = Static<typeof UsuarioIdSchema>;
export type UsuarioPostType = Static<typeof UsuarioPostSchema>;
export type UsuarioPutType = Static<typeof UsuarioPutSchema>;
export type UsuarioType = Static<typeof UsuarioSchema>;
export type usuarioLoginType = Static<typeof UsuarioLoginSchema>;

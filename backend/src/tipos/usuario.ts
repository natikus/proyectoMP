import { Static, Type } from "@sinclair/typebox";
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,20}$/;

export const UsuarioSchema = Type.Object({//esquema utilizado para hacer un get
    id_usuario: Type.Number({ description: "Id para identificar el usuario" }),
    nombre: Type.String({ minLength: 2, maxLength: 50, descriptio: "Nombre del usuario" }),
    apellido: Type.String({ minLength: 2, maxLength: 50, description: "Apellido del usuario" }),
    usuario: Type.String({ minLength: 2, maxLength: 50, description: "Nombre de usuario" }),
    cedula: Type.String({ pattern: cedulaRegex.source, description: "Cédula del usuario" }),
    email: Type.String({ type: 'string', format: 'email', description: "Correo electrónico del usuario" }),
    telefono: Type.String({ pattern: '^[0-9]{9}$', description: "Teléfono del usuario" }),
    foto: Type.String({ description: "Foto del usuario" }),
    is_Admin: Type.Optional(Type.Boolean({ description: "Indica si el usuario es administrador" })),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del usuario" }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time', description: "Fecha de creación del usuario" })),
    intereses: Type.Array(Type.String(), { description: "Intereses del usuario" }),
});
export const UsuarioPostSchema = Type.Object({//Esquema utilizado para hacer un post
    nombre: Type.String({ minLength: 2, maxLength: 50, description: "Nombre del usuario" }),
    apellido: Type.String({ minLength: 2, maxLength: 50, description: "Apellido del usuario" }),
    usuario: Type.String({ minLength: 2, maxLength: 50, description: "Nombre de usuario" }),
    cedula: Type.String({ pattern: cedulaRegex.source, description: "Cédula del usuario" }),
    email: Type.String({ type: 'string', format: 'email', description: "Correo electrónico del usuario" }),
    telefono: Type.String({ pattern: '^[0-9]{9}$', description: "Teléfono del usuario" }),
    foto: Type.String({ description: "Foto del usuario" }),
    is_Admin: Type.Optional(Type.Boolean({ description: "Indica si el usuario es administrador" })),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del usuario" }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time', description: "Fecha de creación del usuario" })),
    intereses: Type.Array(Type.String(), { description: "Intereses del usuario" }),
    contrasena: Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, description: "Contraseña del usuario" }),
});
export const UsuarioPutSchema = Type.Object({//esquema utilizado para hacer un put
    usuario: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Nombre de usuario" })),
    telefono: Type.Optional(Type.String({ pattern: '^[0-9]{9}$', description: "Teléfono del usuario" })),
    foto: Type.Optional(Type.String({ description: "Foto del usuario" })),
    descripcion: Type.Optional(Type.String({ maxLength: 300, description: "Descripción del usuario" })),
    intereses: Type.Optional(Type.Array(Type.String(), { description: "Intereses del usuario" })),
    contrasena: Type.Optional(Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, description: "Contraseña del usuario" })),
});
export const UsuarioIdSchema = Type.Object({
    id: Type.Number({ description: "Id para identificar el usuario" }),
});

export const usuarioLoginSchema = Type.Object({
    contrasena: Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, description: "Contraseña del usuario" }),
    email: Type.String({ type: 'string', format: 'email', description: "Correo electrónico del usuario" }),
})

export type UsuarioIdType = Static<typeof UsuarioIdSchema>;
export type UsuarioPostType = Static<typeof UsuarioPostSchema>;
export type UsuarioPutType = Static<typeof UsuarioPutSchema>;
export type UsuarioType = Static<typeof UsuarioSchema>;
export type usuarioLoginType = Static<typeof usuarioLoginSchema>;
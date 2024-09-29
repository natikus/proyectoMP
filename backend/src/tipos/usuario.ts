import { Static, Type } from "@sinclair/typebox";
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,20}$/;

export const UsuarioSchema = Type.Object({//esquema utilizado para hacer un get
    id_usuario: Type.Number({ description: "Id para identificar el usuario" }),
    nombre: Type.String({ minLength: 2, maxLength: 50 }),
    apellido: Type.String({ minLength: 2, maxLength: 50 }),
    usuario: Type.String({ minLength: 2, maxLength: 50 }),
    cedula: Type.String({ pattern: cedulaRegex.source }),
    email: Type.String({ type: 'string', format: 'email' }),
    telefono: Type.String({ pattern: '^[0-9]{9}$' }),
    foto: Type.String(),
    is_Admin: Type.Optional(Type.Boolean()),
    descripcion: Type.String({ maxLength: 300 }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time' })),
    intereses: Type.Array(Type.String()),
});
export const UsuarioPostSchema = Type.Object({//esquema utilizado para hacer un post
    nombre: Type.String({ minLength: 2, maxLength: 50 }),
    apellido: Type.String({ minLength: 2, maxLength: 50 }),
    usuario: Type.String({ minLength: 2, maxLength: 50 }),
    cedula: Type.String({ pattern: cedulaRegex.source }),
    email: Type.String({ type: 'string', format: 'email' }),
    telefono: Type.String({ pattern: '^[0-9]{9}$' }),
    foto: Type.String(),
    is_Admin: Type.Optional(Type.Boolean()),
    descripcion: Type.String({ maxLength: 300 }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time' })),
    intereses: Type.Array(Type.String()),
    contrasena: Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, }),
});
export const UsuarioPutSchema = Type.Object({//esquema utilizado para hacer un put
    usuario: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
    telefono: Type.Optional(Type.String({ pattern: '^[0-9]{9}$' })),
    foto: Type.Optional(Type.String()),
    descripcion: Type.Optional(Type.String({ maxLength: 300 })),
    intereses: Type.Optional(Type.Array(Type.String())),
    contrasena: Type.Optional(Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, })),
});
export const UsuarioIdSchema = Type.Object({
    id: Type.Number(),
});

export type UsuarioIdType = Static<typeof UsuarioIdSchema>;
export type UsuarioPostType = Static<typeof UsuarioPostSchema>;
export type UsuarioPutType = Static<typeof UsuarioPutSchema>;
export type UsuarioType = Static<typeof UsuarioSchema>;
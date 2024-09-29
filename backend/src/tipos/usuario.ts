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
    foto: Type.String({description: "Foto del usuario"}),
    is_Admin: Type.Optional(Type.Boolean({description: "Indica si el usuario es administrador"})),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del usuario" }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time', description: "Fecha de creación del usuario" })),
    intereses: Type.Array(Type.String(), {description: "Intereses del usuario"}),
},
{
    examples: [
        { id_usuario: 1, nombre: "Usuario 1", apellido: "Apellido 1", usuario: "usuario1", cedula: "1.234.567-8", email: "example1@example.com", telefono: "123456789", foto: "foto1.jpg", is_Admin: true, descripcion: "Descripción del usuario 1", fechaCreacion: "2021-10-10T14:48:00.000Z", intereses: ["interes1", "interes2"] },
        { id_usuario: 2, nombre: "Usuario 2", apellido: "Apellido 2", usuario: "usuario2", cedula: "1.234.567-8", email: "example2@example.com", telefono: "123456789", foto: "foto2.jpg", is_Admin: false, descripcion: "Descripción del usuario 2", fechaCreacion: "2021-10-10T14:48:00.000Z", intereses: ["interes3", "interes4"] },
    ],
}
);
export const UsuarioPostSchema = Type.Object({//esquema utilizado para hacer un post
    nombre: Type.String({ minLength: 2, maxLength: 50, description: "Nombre del usuario" }),
    apellido: Type.String({ minLength: 2, maxLength: 50, description: "Apellido del usuario" }),
    usuario: Type.String({ minLength: 2, maxLength: 50, description: "Nombre de usuario" }),
    cedula: Type.String({ pattern: cedulaRegex.source, description: "Cédula del usuario" }),
    email: Type.String({ type: 'string', format: 'email', description: "Correo electrónico del usuario" }),
    telefono: Type.String({ pattern: '^[0-9]{9}$', description: "Teléfono del usuario" }),
    foto: Type.String({description: "Foto del usuario"}),
    is_Admin: Type.Optional(Type.Boolean({description: "Indica si el usuario es administrador"})),
    descripcion: Type.String({ maxLength: 300, description: "Descripción del usuario" }),
    fechaCreacion: Type.Optional(Type.String({ format: 'date-time', description: "Fecha de creación del usuario" })),
    intereses: Type.Array(Type.String(), {description: "Intereses del usuario"}),
    contrasena: Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, description: "Contraseña del usuario" }),
},
{
    examples: [
        { nombre: "Usuario 1", apellido: "Apellido 1", usuario: "usuario1", cedula: "1.234.567-8", email: "example1@example.com", telefono: "123456789", foto: "foto1.jpg", is_Admin: true, descripcion: "Descripción del usuario 1", fechaCreacion: "2021-10-10T14:48:00.000Z", intereses: ["interes1", "interes2"], contrasena: "Contrasena1" },
        { nombre: "Usuario 2", apellido: "Apellido 2", usuario: "usuario2", cedula: "1.234.567-8", email: "example2@example.com", telefono: "123456789", foto: "foto2.jpg", is_Admin: false, descripcion: "Descripción del usuario 2", fechaCreacion: "2021-10-10T14:48:00.000Z", intereses: ["interes3", "interes4"], contrasena: "Contrasena2" }
    ],
}
);
export const UsuarioPutSchema = Type.Object({//esquema utilizado para hacer un put
    usuario: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Nombre de usuario" })),
    telefono: Type.Optional(Type.String({ pattern: '^[0-9]{9}$', description: "Teléfono del usuario" })),
    foto: Type.Optional(Type.String({description: "Foto del usuario"})),
    descripcion: Type.Optional(Type.String({ maxLength: 300, description: "Descripción del usuario" })),
    intereses: Type.Optional(Type.Array(Type.String(), {description: "Intereses del usuario"})),
    contrasena: Type.Optional(Type.String({ minLength: 8, maxLength: 20, pattern: passwordRegex.source, description: "Contraseña del usuario" })),
},
{
    examples: [
        { usuario: "usuario1", telefono: "123456789", foto: "foto1.jpg", descripcion: "Descripción del usuario 1", intereses: ["interes1", "interes2"], contrasena: "Contrasena1" },
        { usuario: "usuario2", telefono: "123456789", foto: "foto2.jpg", descripcion: "Descripción del usuario 2", intereses: ["interes3", "interes4"], contrasena: "Contrasena2" }
    ],
}
);
export const UsuarioIdSchema = Type.Object({
    id: Type.Number({ description: "Id para identificar el usuario" }),
},
{
    examples: [
        { id: 1 },
        { id: 2 },
    ]
}
);

export type UsuarioIdType = Static<typeof UsuarioIdSchema>;
export type UsuarioPostType = Static<typeof UsuarioPostSchema>;
export type UsuarioPutType = Static<typeof UsuarioPutSchema>;
export type UsuarioType = Static<typeof UsuarioSchema>;
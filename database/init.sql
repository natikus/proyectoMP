CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    cedula TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL UNIQUE,
    foto TEXT,
    is_Admin BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion TEXT NOT NULL,
    fechaCreacion DATE NOT NULL DEFAULT CURRENT_DATE,
    intereses TEXT[] NOT NULL,
    contrasena TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    id_creador INTEGER NOT NULL,
    descripcion TEXT NOT NULL, 
    imagenes TEXT NOT NULL, 
    ubicacion TEXT NOT NULL, 
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    etiquetas TEXT[] NOT NULL, 
    CONSTRAINT fk_creador FOREIGN KEY (id_creador) REFERENCES usuarios(id) 
);

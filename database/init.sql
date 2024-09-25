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
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion TEXT NOT NULL,
    fechaCreacion DATE NOT NULL DEFAULT CURRENT_DATE,
    intereses TEXT NOT NULL,
    contrasena TEXT NOT NULL
);
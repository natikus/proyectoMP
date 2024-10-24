CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarioFisico (
    id_persona SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarioVirtual (
    id_usuario SERIAL PRIMARY KEY,
    id_persona INTEGER NOT NULL UNIQUE,
    usuario TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    foto TEXT,
    is_Admin BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion TEXT NOT NULL,
    fechaCreacion DATE NOT NULL DEFAULT CURRENT_DATE,
    intereses TEXT[] NOT NULL,
    contrasena TEXT NOT NULL,
    CONSTRAINT fk_creador FOREIGN KEY (id_persona) REFERENCES usuarioFisico(id_persona)
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
    CONSTRAINT fk_creador FOREIGN KEY (id_creador) REFERENCES usuarioVirtual(id_usuario)
);

CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    etiqueta TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publicacion_etiquetas (
    id_publicacion INTEGER NOT NULL,
    id_etiqueta INTEGER NOT NULL,
    PRIMARY KEY (id_publicacion, id_etiqueta),
    CONSTRAINT fk_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_etiqueta FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE
);


INSERT INTO usuarioFisico (nombre, apellido, cedula) 
VALUES 
('Juan', 'Perez', '1234567890'),
('Maria', 'Lopez', '0987654321');

INSERT INTO usuarioVirtual (id_persona, usuario, email, foto, is_Admin, descripcion, intereses, contrasena) 
VALUES 
(1, 'juanp', 'juan.perez@example.com', '/foto_juan.jpg', FALSE, 'Me gusta ayudar a las personas', ARRAY['tecnología', 'programación'], crypt('Password123!', gen_salt('bf'))),
(2, 'marial', 'maria.lopez@example.com', '/foto_maria.jpg', TRUE, 'Intento hacer un mundo mejor', ARRAY['arte', 'diseño'], crypt('Supersecurepassword1!', gen_salt('bf')));

INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion) 
VALUES 
('Mi primer post', 1, 'Este es el contenido de mi primer post', '/imagen1.jpg', 'Quito'),
('Diseño de logotipos', 2, 'Ofrezco servicios de diseño de logotipos', '/imagen2.jpg', 'Guayaquil');


INSERT INTO etiquetas (etiqueta)
VALUES 
('tecnología'),
('web'),
('diseño'),
('arte');

INSERT INTO publicacion_etiquetas (id_publicacion, id_etiqueta)
VALUES 
(1, 1), 
(1, 2), 
(2, 3), 
(2, 4);
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
    etiquetas TEXT[] NOT NULL, 
    CONSTRAINT fk_creador FOREIGN KEY (id_creador) REFERENCES usuarioVirtual(id_usuario) 
    CONSTRAINT fk_etiquetas FOREIGN KEY (etiquetas) REFERENCES etiquetas(id_etiqueta) 
);
CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL,
    etiqueta TEXT NOT NULL UNIQUE, 
    CONSTRAINT fk_creador FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) 
);
INSERT INTO usuarioFisico (nombre, apellido, cedula) 
VALUES 
('Juan', 'Perez', '1234567890'),
('Maria', 'Lopez', '0987654321');
INSERT INTO usuarioVirtual (id_persona, usuario, email, foto, is_Admin, descripcion, intereses, contrasena) 
VALUES 
(1, 'juanp', 'juan.perez@example.com', '/foto_juan.jpg', FALSE, 'Me gusta ayudar a las personas', ARRAY['tecnología', 'programación'], crypt('Password123!', gen_salt('bf'))),
(2, 'marial', 'maria.lopez@example.com', '/foto_maria.jpg', TRUE, 'Intento hacer un mundo mejor', ARRAY['arte', 'diseño'], crypt('Supersecurepassword1!', gen_salt('bf')));
          
INSERT INTO publicaciones (titulo,  id_creador, descripcion, imagenes, ubicacion, etiquetas) 
VALUES 
('Mi primer post',  1, 'Este es el contenido de mi primer post', '/imagen1.jpg', 'Quito', ARRAY['tecnología', 'web']),
('Diseño de logotipos',  2, 'Ofrezco servicios de diseño de logotipos', '/imagen2.jpg', 'Guayaquil', ARRAY['diseño', 'arte']);
INSERT INTO etiquetas (id_publicacion, etiqueta)
VALUES 
(1, 'tecnología'),
(1, 'web'),
(2, 'diseño'),
(2, 'arte');
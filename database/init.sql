CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Definimos la tabla usuarioVirtual antes, ya que celular y publicaciones dependen de ella
CREATE TABLE IF NOT EXISTS usuarioVirtual (
    id_persona SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    is_Admin BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion TEXT NOT NULL,
    imagen TEXT NOT NULL,
    fechaCreacion DATE NOT NULL DEFAULT CURRENT_DATE,
    intereses TEXT[] NOT NULL,
    contrasena TEXT NOT NULL
);

-- Tabla celular, con una referencia a usuarioVirtual
CREATE TABLE IF NOT EXISTS celular (
    id_persona INTEGER PRIMARY KEY,
    celular TEXT NOT NULL UNIQUE,
    CONSTRAINT fk_persona FOREIGN KEY (id_persona) REFERENCES usuarioVirtual(id_persona) ON DELETE CASCADE
);

-- Tabla publicaciones, con una referencia a usuarioVirtual
CREATE TABLE IF NOT EXISTS publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    id_creador INTEGER NOT NULL,
    descripcion TEXT NOT NULL, 
    imagenes TEXT NOT NULL, 
    ubicacion TEXT NOT NULL, 
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creador FOREIGN KEY (id_creador) REFERENCES usuarioVirtual(id_persona) ON DELETE CASCADE
);

-- Tabla etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    etiqueta TEXT NOT NULL UNIQUE
);

-- Tabla de relación entre publicaciones y etiquetas
CREATE TABLE IF NOT EXISTS publicacion_etiquetas (
    id_publicacion INTEGER NOT NULL,
    id_etiqueta INTEGER NOT NULL,
    PRIMARY KEY (id_publicacion, id_etiqueta),
    CONSTRAINT fk_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_etiqueta FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE
);

-- Insertar datos en usuarioVirtual
INSERT INTO usuarioVirtual (nombre, apellido, usuario, email,  is_Admin, descripcion, imagen, intereses, contrasena) 
VALUES 
('Juan', 'Perez', 'juanp', 'juan.perez@example.com',  FALSE, 'Me gusta ayudar a las personas', '/imagen11.jpg',ARRAY['tecnología', 'programación'], crypt('Password123!', gen_salt('bf'))),
('Maria', 'Lopez', 'marial', 'maria.lopez@example.com',  TRUE, 'Intento hacer un mundo mejor', '/imagen22.jpg',ARRAY['arte', 'diseño'], crypt('Supersecurepassword1!', gen_salt('bf')));

-- Insertar datos en celular
INSERT INTO celular (id_persona, celular) 
VALUES 
(1, '1234567890'),
(2, '0987654321');

-- Insertar datos en publicaciones
INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion) 
VALUES 
('Mi primer post', 1, 'Este es el contenido de mi primer post', '/imagen1.jpg', 'Quito'),
('Diseño de logotipos', 2, 'Ofrezco servicios de diseño de logotipos', '/imagen2.jpg', 'Guayaquil');

-- Insertar datos en etiquetas
INSERT INTO etiquetas (etiqueta)
VALUES 
('tecnología'),
('web'),
('diseño'),
('arte');

-- Insertar datos en publicacion_etiquetas
INSERT INTO publicacion_etiquetas (id_publicacion, id_etiqueta)
VALUES 
(1, 1), 
(1, 2), 
(2, 3), 
(2, 4);

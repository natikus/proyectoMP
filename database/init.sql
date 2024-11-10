CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE IF NOT EXISTS usuarios (
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
    telefono TEXT NOT NULL UNIQUE,
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
    CONSTRAINT fk_creador FOREIGN KEY (id_creador) REFERENCES usuarios(id_persona) ON DELETE CASCADE
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


INSERT INTO usuarios (nombre, apellido, usuario, email,  is_Admin, descripcion, imagen, intereses,telefono, contrasena) 
VALUES 
('Juan', 'Perez', 'juanp', 'juan.perez@example.com',  FALSE, 'Me gusta ayudar a las personas', '/boris.jpg',ARRAY['tecnología', 'programación'],  '59892070235',crypt('Password123!', gen_salt('bf'))),
('Maria', 'Lopez', 'marial', 'maria.lopez@example.com',  TRUE, 'Intento hacer un mundo mejor', '/IMG_20230410_185647_349.jpg',ARRAY['arte', 'diseño'],  '59891265322',crypt('Password123!', gen_salt('bf')));



INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion) 
VALUES 
('Mi primer post', 1, 'Me sobra esta mesa',  '/mesa.jpg' , 'Quito'),
('Diseño de logotipos', 2, 'Me sobra esta silla', '/silla.jpeg' , 'Guayaquil');


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

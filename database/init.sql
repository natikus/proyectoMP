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
    intereses TEXT[] NOT NULL,
    telefono TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
    
);



CREATE TABLE IF NOT EXISTS publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    comunidad BOOLEAN NOT NULL DEFAULT FALSE,
    id_creador INTEGER NOT NULL,
    descripcion TEXT NOT NULL, 
    imagenes TEXT NOT NULL, 
    ubicacion TEXT NOT NULL, 
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
CREATE TABLE IF NOT EXISTS comunidades (
    id_comunidad SERIAL PRIMARY KEY,
    comunidad TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publicacion_comunidad (
    id_publicacion INTEGER NOT NULL,
    id_comunidad INTEGER NOT NULL,
    PRIMARY KEY (id_publicacion, id_comunidad),
    CONSTRAINT fk_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_etiqueta FOREIGN KEY (id_comunidad) REFERENCES comunidades(id_comunidad) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS usuario_comunidad (
    id_persona INTEGER NOT NULL,
    id_comunidad INTEGER NOT NULL,
    PRIMARY KEY (id_persona, id_comunidad),
    CONSTRAINT fk_publicacion FOREIGN KEY (id_persona) REFERENCES usuarios(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_etiqueta FOREIGN KEY (id_comunidad) REFERENCES comunidades(id_comunidad) ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, apellido, usuario, email,  is_Admin, descripcion, imagen, intereses,telefono, contrasena) 
VALUES 
('Juan', 'Perez', 'juanp', 'juan.perez@example.com',  FALSE, 'Me gusta ayudar a las personas', '/boris.jpg',ARRAY['tecnología', 'programación'],  '59892070238',crypt('Password123!', gen_salt('bf'))),
('Jorge', 'Melnik', 'Melnik', 'jmelnik19@gmail.com',  TRUE, 'Lisenciado en tecnologia de la información', '/boris.jpg',ARRAY['informacion', 'Datos'],  '59892070234',crypt('@Jmelnik19.', gen_salt('bf'))),
('Natasha', 'Kusminksy', 'Kusminsky', 'natasha@kusminsky.com',  FALSE, 'Si Dios quiere, desarrolladora de software', '/boris.jpg',ARRAY['gatos', 'crochet'],  '59892070235',crypt('@KusminskyNatasha1.', gen_salt('bf'))),
('Maria', 'Lopez', 'marial', 'maria.lopez@example.com',  TRUE, 'Intento hacer un mundo mejor', '/IMG_20230410_185647_349.jpg',ARRAY['arte', 'diseño'],  '59891265322',crypt('Password123!', gen_salt('bf')));



INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion, comunidad) 
VALUES 
('Mesa de madera', 1, 'Me sobra esta mesa',  '/mesa.jpg' , 'Quito', TRUE),
('Silla de madera antigua', 2, 'Me sobra esta silla', '/silla.jpeg' , 'Guayaquil', TRUE),
('Acuarela Inspiradora', 2, 'Intercambio por bicicleta', '/acuarelas.png', 'Cuenca', TRUE),
('Reproductor de musica', 1, 'Reproductor de muscia perfecto estado', '/musica.png', 'Loja', TRUE),
('Carrito de compras', 2, 'Carrito de compras adquirido legalmente, intercambio por teclado mecanico', '/carrito.png', 'Ambato', FALSE),
('Cremas artesanales', 2, 'Doy cremas artensanales para que prueben', '/cremas.png', 'Manta', FALSE),
('Chef gratis!!', 1, 'Coy practicante de chef y necesito expetiencia', '/caldo.png', 'Riobamba', FALSE),
('celulares', 2, 'Telefonos encontrados en una caja, funconan perfectamente', '/telefonos.png', 'Ibarra', FALSE),
('Colocacion De Vidrios', 1, 'Instalo vidrios, es para ganar experinecia', '/bidrios.png', 'Esmeraldas', FALSE);



INSERT INTO etiquetas (etiqueta)
VALUES 
('tecnología'),
('web'),
('diseño'),
('arte');

INSERT INTO comunidades (comunidad)
VALUES 
('perros'),
('gatos'),
('muebles'),
('maderas');
INSERT INTO publicacion_etiquetas (id_publicacion, id_etiqueta)
VALUES 
(1, 1), 
(1, 2), 
(2, 3), 
(2, 4);
INSERT INTO publicacion_comunidad (id_publicacion, id_comunidad)
VALUES 
(1, 1), 
(3, 2), 
(4, 3), 
(2, 4);
INSERT INTO usuario_comunidad (id_persona, id_comunidad)
VALUES 
(1, 1), 
(4, 2), 
(2, 3), 
(1, 4);
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
CREATE TABLE IF NOT EXISTS amigos (
    id_amigo2  INTEGER NOT NULL,
    id_amigo1  INTEGER NOT NULL,
    PRIMARY KEY (id_amigo2, id_amigo1),
    CONSTRAINT fk_amigo1 FOREIGN KEY (id_amigo1) REFERENCES usuarios(id_persona) ON DELETE CASCADE,
    CONSTRAINT fk_amigo2 FOREIGN KEY (id_amigo2) REFERENCES usuarios(id_persona) ON DELETE CASCADE
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
('Natasha', 'Kusminsky', 'nat', 'natikumy@gmail.com',  TRUE, 'ojala pasar', '/silla.jpeg',ARRAY['sillas', 'animales'],  '59892070215',crypt('1234qweR$', gen_salt('bf'))),
('Maria', 'Lopez', 'marial', 'maria.lopez@example.com',  TRUE, 'Intento hacer un mundo mejor', '/IMG_20230410_185647_349.jpg',ARRAY['arte', 'diseño'],  '59891265322',crypt('Password123!', gen_salt('bf')));



INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion) 
VALUES 
('Mesa de madera', 1, 'Me sobra esta mesa',  '/mesa.jpg' , 'Quito'),
('Silla de madera antigua', 2, 'Me sobra esta silla', '/silla.jpeg' , 'Guayaquil'),
('Acuarela Inspiradora', 3, 'Intercambio por bicicleta', '/acuarelas.png', 'Cuenca'),
('Reproductor de musica', 1, 'Reproductor de muscia perfecto estado', '/musica.png', 'Loja'),
('Carrito de compras',3 , 'Carrito de compras adquirido legalmente, intercambio por teclado mecanico', '/carrito.png', 'Ambato'),
('Cremas artesanales', 2, 'Doy cremas artensanales para que prueben', '/cremas.png', 'Manta'),
('Chef gratis!!', 3, 'Coy practicante de chef y necesito expetiencia', '/caldo.png', 'Riobamba'),
('celulares', 2, 'Telefonos encontrados en una caja, funconan perfectamente', '/telefonos.png', 'Ibarra'),
('Colocacion De Vidrios', 1, 'Instalo vidrios, es para ganar experinecia', '/bidrios.png', 'Esmeraldas');



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
INSERT INTO amigos (id_amigo1, id_amigo2)
VALUES 
(1, 1), 
(1, 2), 
(2, 1), 
(2, 3);


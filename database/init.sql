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


CREATE TABLE IF NOT EXISTS publicacion_etiquetas (
    id_publicacion INTEGER NOT NULL,
    id_etiqueta INTEGER NOT NULL,
    PRIMARY KEY (id_publicacion, id_etiqueta),
    CONSTRAINT fk_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_etiqueta FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE
);


INSERT INTO usuarios (nombre, apellido, usuario, email,  is_Admin, descripcion, imagen, intereses,telefono, contrasena) 
VALUES 
('Juan', 'Perez', 'juanp', 'juan.perez@example.com',  FALSE, 'Me gusta ayudar a las personas', '/boris.jpg',ARRAY['tecnología', 'programación'],  '59892070236',crypt('Password123!', gen_salt('bf'))),
('Natasha', 'Kusminsky', 'natik', 'natikumy@gmail.com',  TRUE, 'Soy la creadora', '/naty.jpeg',ARRAY['mesas', 'web', 'diseño', 'arte', 'muebles', 'ropa', 'electrodomésticos', 'libros', 'juguetes', 'decoración', 'animales perdidos', 'animales en adopción', 'herramientas', 'instrumentos musicales', 'deporte', 'camping y exteriores', 'jardinería', 'vehículos', 'accesorios para vehículos', 'bicicletas', 'material de oficina', 'manualidades', 'coleccionables', 'videojuegos', 'consolas', 'cámaras y fotografía', 'películas y música', 'antigüedades', 'belleza y cuidado personal', 'equipos médicos', 'escolares', 'ropa infantil', 'accesorios para mascotas', 'iluminación', 'cocina', 'utensilios de cocina', 'viajes', 'software', 'hardware', 'relojes', 'joyería', 'maletas y mochilas', 'patinetes y scooters', 'comida y bebida', 'material de construcción', 'decoración de eventos', 'cosmética natural', 'ropa deportiva', 'maternidad', 'calzado', 'papelería', 'juegos de mesa', 'colecciones de arte', 'plantas y flores', 'artículos de segunda mano', 'piezas de repuesto', 'artículos vintage', 'material de reciclaje', 'hogar inteligente', 'movilidad eléctrica'],  '59892070235',crypt('1234qweR$', gen_salt('bf'))),
('Maria', 'Lopez', 'marial', 'maria.lopez@example.com',  TRUE, 'Intento hacer un mundo mejor', '/IMG_20230410_185647_349.jpg',ARRAY['arte', 'diseño'],  '59891265322',crypt('Password123!', gen_salt('bf')));



INSERT INTO publicaciones (titulo, id_creador, descripcion, imagenes, ubicacion) 
VALUES 
('Mesa de madera', 1, 'Me sobra esta mesa',  '/publicaciones/mesa.jpg' , 'Quito'),
('Silla de madera antigua', 2, 'Me sobra esta silla', '/publicaciones/silla.jpeg' , 'Guayaquil'),
('Acuarela Inspiradora', 3, 'Intercambio por bicicleta', '/publicaciones/acuarelas.png', 'Cuenca'),
('Reproductor de musica', 1, 'Reproductor de muscia perfecto estado', '/publicaciones/musica.png', 'Loja'),
('Carrito de compras', 2, 'Carrito de compras adquirido legalmente, intercambio por teclado mecanico', '/publicaciones/carrito.png', 'Ambato'),
('Cremas artesanales', 3, 'Doy cremas artensanales para que prueben', '/publicaciones/cremas.png', 'Manta'),
('Chef gratis!!', 3, 'Coy practicante de chef y necesito expetiencia', '/publicaciones/caldo.png', 'Riobamba'),
('celulares', 2, 'Telefonos encontrados en una caja, funconan perfectamente', '/publicaciones/telefonos.png', 'Ibarra'),
('Colocacion De Vidrios', 1, 'Instalo vidrios, es para ganar experinecia', '/publicaciones/bidrios.png', 'Esmeraldas');



INSERT INTO etiquetas (etiqueta)
VALUES
('mesas'),
('tecnología'),
('web'),
('diseño'),
('arte'),
('muebles'),
('ropa'),
('electrodomésticos'),
('libros'),
('juguetes'),
('decoración'),
('animales perdidos'),
('animales en adopción'),
('herramientas'),
('instrumentos musicales'),
('deporte'),
('camping y exteriores'),
('jardinería'),
('vehículos'),
('accesorios para vehículos'),
('bicicletas'),
('material de oficina'),
('manualidades'),
('coleccionables'),
('videojuegos'),
('consolas'),
('cámaras y fotografía'),
('películas y música'),
('antigüedades'),
('belleza y cuidado personal'),
('equipos médicos'),
('escolares'),
('ropa infantil'),
('accesorios para mascotas'),
('iluminación'),
('cocina'),
('utensilios de cocina'),
('viajes'),
('software'),
('hardware'),
('relojes'),
('joyería'),
('maletas y mochilas'),
('patinetes y scooters'),
('comida y bebida'),
('material de construcción'),
('decoración de eventos'),
('cosmética natural'),
('ropa deportiva'),
('maternidad'),
('calzado'),
('papelería'),
('juegos de mesa'),
('colecciones de arte'),
('plantas y flores'),
('artículos de segunda mano'),
('piezas de repuesto'),
('artículos vintage'),
('material de reciclaje'),
('hogar inteligente'),
('movilidad eléctrica');



INSERT INTO publicacion_etiquetas (id_publicacion, id_etiqueta)
VALUES 
(1, 1), 
(1, 2), 
(2, 3), 
(2, 4);

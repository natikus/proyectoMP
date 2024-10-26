

export interface publicaciones {
  id_publicacion: number;
  titulo: string;
  estado: boolean;
  id_creador: number;
  descripcion: string;
  imagenes: string;
  ubicacion: string;
  fechaCreacion: string;
  etiqueta: string[];
}

export interface publicacionesPost {
  titulo: string;
  id_creador: number;
  descripcion: string;
  imagenes: string;
  ubicacion: string;
  fechaCreacion: string;
  etiqueta: string[];
}



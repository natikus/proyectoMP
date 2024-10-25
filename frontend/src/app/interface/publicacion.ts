export interface usuarioFisico {
  nombre: string;
  apellido: string;
  cedula: number;
}

export interface usuarioVirtual {
  id_persona: number;
  usuario: string;
  email: string;
  foto: string;
  descripcion: string;
  intereses: string[];
  contrasena: string;
}

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

export interface etiquetas {
  id_publicacion: number;
  etiqueta: string;
}

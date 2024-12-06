export interface amigo {
  id_amigo1: number;
}

export interface usuarios {
  nombre: string;
  apellido: string;
  id_persona: number;
  usuario: string;
  email: string;
  imagen: string;
  is_Admin: boolean;
  descripcion: string;
  intereses: string[];
  contrasena: string;
  telefono: string;
}
export interface usuariosPost {
  nombre: string;
  apellido: string;
  usuario: string;
  email: string;
  imagen: string;
  descripcion: string;
  intereses: string[];
  contrasena: string;
  telefono: string;
}

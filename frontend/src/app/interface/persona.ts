export interface celular {
  celular: number;
}

export interface usuarioVirtual {
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
}
export interface usuarioVirtualPost {
  nombre: string;
  apellido: string;
  usuario: string;
  email: string;
  imagen: string;
  descripcion: string;
  intereses: string[];
  contrasena: string;
}

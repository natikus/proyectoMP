export interface usuarioFisico {
  nombre: string;
  apellido: string;
  cedula: number;
  celular: number;
}

export interface usuarioVirtual {
  id_persona: number;
  usuario: string;
  email: string;
  foto: string;
  is_Admin: boolean;
  descripcion: string;
  intereses: string[];
  contrasena: string;
}

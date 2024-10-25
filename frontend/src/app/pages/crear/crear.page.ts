import { Component } from '@angular/core';
import { publicaciones } from '../../interface/publicacion';
import { ApiRestService } from '../../servicios/api-rest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.page.html',
  styleUrl: './crear.page.css',
})
export class CrearPage {
  publicacion: publicaciones = {
    id_publicacion: 0,
    titulo: '',
    estado: true,
    id_creador: 1, // Aquí puedes asignar el id del usuario autenticado
    descripcion: '',
    imagenes: '',
    ubicacion: '',
    fechaCreacion: '',
    etiqueta: [],
  };

  etiqueta: string = '';

  constructor(private apiService: ApiRestService) {}

  addEtiqueta(event: Event): void {
    event.preventDefault();
    if (this.etiqueta.trim()) {
      this.publicacion.etiqueta.push(this.etiqueta.trim());
      this.etiqueta = '';
    }
  }

  removeEtiqueta(etiqueta: string): void {
    this.publicacion.etiqueta = this.publicacion.etiqueta.filter(
      (e) => e !== etiqueta
    );
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.publicacion.imagenes = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      // Utiliza el método post del servicio ApiRestService
      const response = await this.apiService.postPublicacion(
        'publicaciones',
        this.publicacion
      );
      console.log('Publicación creada con éxito:', response);
      // Aquí puedes redirigir a otra página o mostrar un mensaje
    } catch (error) {
      console.error('Error al crear la publicación:', error);
    }
  }
}

import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { publicaciones } from '../../interface/publicacion';
@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion = input<publicaciones | undefined>(undefined);
  showLink = input<boolean>(true);
  getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  verPublicacion(id?: number) {
    if (id !== undefined) {
      localStorage.setItem('id_publicacion', id.toString());
      console.log('ID seteada:', id);
    } else {
      console.error('ID no está definida');
    }
  }
}

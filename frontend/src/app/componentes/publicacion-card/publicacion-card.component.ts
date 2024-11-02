import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { etiquetas } from '../../interface/etiqueta';
@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [PublicacionComponent, RouterLink, CommonModule, DatePipe],
  templateUrl: './publicacion-card.component.html',
  styleUrls: ['./publicacion-card.component.scss'],
})
export class PublicacionCardComponent {
  apiService = inject(ApiRestService);
  publicacion?: publicaciones;
  id!: number;
  etiquetas?: etiquetas[];
  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const storedId = localStorage.getItem('id_publicacion');

    if (storedId) {
      this.id = parseInt(storedId, 10);
      console.log('ID de la publicación desde localStorage:', this.id);
    } else {
      console.error('No se encontró el ID de la publicación en localStorage');
      return;
    }
    try {
      this.publicacion = await this.apiService.get(`publicaciones/${this.id}`);
      console.log(this.publicacion);
    } catch {
      console.log('cargando publicacion');
    }
    try {
      this.etiquetas = await this.apiService.get(
        `publicaciones/${this.id}/etiquetas`
      );
      console.log(this.etiquetas);
    } catch {
      console.log('cargando etiquetas');
    }
  }
}

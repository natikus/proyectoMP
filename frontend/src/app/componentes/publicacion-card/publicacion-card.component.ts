import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { etiquetas } from '../../interface/etiqueta';
import { IonButton } from '@ionic/angular/standalone';
import { usuarios } from '../../interface/persona';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [
    PublicacionComponent,
    RouterLink,
    CommonModule,
    DatePipe,
    IonButton,
  ],
  templateUrl: './publicacion-card.component.html',
  styleUrls: ['./publicacion-card.component.scss'],
})
export class PublicacionCardComponent {
  apiService = inject(ApiRestService);
  publicacion?: publicaciones;
  usuario?: usuarios;
  id!: number;
  etiquetas?: etiquetas[];
  etiquetasNombres: string[] = [];

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
      console.log('Cargando publicación');
    }

    try {
      this.etiquetas = await this.apiService.get(
        `publicaciones/${this.id}/etiquetas`
      );
      console.log(this.etiquetas);
      if (this.etiquetas) {
        this.etiquetasNombres = this.etiquetas.map(
          (etiqueta) => etiqueta.etiqueta
        );
        console.log('Nombres de etiquetas:', this.etiquetasNombres);
      } else {
        console.log('No se encontraron etiquetas');
      }
    } catch {
      console.log('Cargando etiquetas');
    }
  }
  async self() {
    const storedId = localStorage.getItem('id_persona');
    const id_creador = localStorage.getItem('id_creador');
  }
  async openWhatsApp() {
    const storedId = localStorage.getItem('id_persona');
    this.usuario = await this.apiService.get(`usuario/${storedId}`);
    const phoneNumber = this.usuario?.telefono;
    const url = `https://wa.me/${phoneNumber}?
    )}`;

    window.open(url, '_blank');
  }
}

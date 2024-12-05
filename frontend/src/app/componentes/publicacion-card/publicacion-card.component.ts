import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { etiquetas } from '../../interface/etiqueta';
import {
  IonButton,
  IonImg,
  IonText,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { usuarios } from '../../interface/persona';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [IonRow, IonCol, CommonModule, IonButton, IonImg, IonText],
  templateUrl: './publicacion-card.component.html',
  styleUrls: ['./publicacion-card.component.css'],
})
export class PublicacionCardComponent {
  apiService = inject(ApiRestService);
  router: Router = inject(Router);
  publicacion?: publicaciones;
  usuario?: usuarios;
  id!: number;
  etiquetas?: etiquetas[];
  etiquetasNombres: string[] = [];
  sos: boolean = false;
  constructor(private route: ActivatedRoute) {}

  localhost?: string = '10.4.201.163';
  getImagenUrl(imagen: string | undefined): string {
    const baseUrl = `https://${this.localhost}/backend`; // Cambia a https si el servidor usa HTTPS
    if (!imagen) {
      console.error('Imagen no especificada');
      return '';
    }
    const imageUrl = `${baseUrl}/uploads${imagen}`;
    console.log(imageUrl, 'LA FOTOO');
    return imageUrl;
  }

  async ngOnInit(): Promise<void> {
    this.self();
    const storedId = localStorage.getItem('id_publicacion');

    if (storedId) {
      this.id = parseInt(storedId, 10);
      console.log('ID de la publicación desde localStorage:', this.id);
    } else {
      console.error('No se encontró el ID de la publicación en localStorage');
      return;
    }

    try {
      console.log('Obtieniendo la publicacion');
      this.publicacion = await this.apiService.get(`publicaciones/${this.id}`);
      console.log(this.publicacion);
    } catch {
      console.warn('No se puede cargar la publcacion');
    }

    try {
      console.log('obteniendo las etiquetas de la publicacion');
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
      console.warn('No se pudo obtener las etiquetas');
    }
  }
  async self() {
    console.log('LOCAL STORAGE', localStorage);
    const storedId = localStorage.getItem('id_persona');
    const id_creador = localStorage.getItem('id_creador');
    if (storedId == id_creador) {
      this.sos = true;
    }
  }
  async openWhatsApp() {
    const storedId = localStorage.getItem('id_persona');
    this.usuario = await this.apiService.get(`usuario/${storedId}`);
    const phoneNumber = this.usuario?.telefono;
    const url = `https://wa.me/${phoneNumber}?
    )}`;

    window.open(url, '_blank');
  }
  async finalizar() {
    const storedId = localStorage.getItem('id_publicacion');
    if (storedId) {
      const response = await this.apiService.finPublicacion(storedId);
      console.log(response);

      window.alert('Publicacion fenalizada');

      this.router.navigate(['inicio']);
    }
  }
}

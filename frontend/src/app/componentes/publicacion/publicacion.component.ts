import { Component, inject, input } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { publicaciones } from '../../interface/publicacion';
import { usuarios } from '../../interface/persona';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonFooter,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
  IonRow,
  IonContent,
  IonGrid,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [
    IonContent,
    IonRow,
    IonCard,
    RouterLink,
    IonImg,
    IonCardContent,
    IonText,
    IonAvatar,
    IonItem,
    IonLabel,
    IonGrid,
    IonCol,
    CommonModule,
  ],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion = input<publicaciones | undefined>(undefined);
  showLink = input<boolean>(true);
  usuario = input<usuarios | undefined>(undefined);
  router: Router = inject(Router);
  localhost?: string = '10.4.201.163';
  get publicacionData(): publicaciones | undefined {
    return this.publicacion();
  }
  get usuarioData(): usuarios | undefined {
    return this.usuario();
  }
  getImagenUrl(imagen: string | undefined): string {
    const baseUrl = `https://${this.localhost}/backend`; // Cambia a https si el servidor usa HTTPS

    const imageUrl = `${baseUrl}/uploads/${imagen}`;
    return imageUrl;
  }
  getImagenPersonaUrl(imagen: string | undefined): string {
    const baseUrl = `https://${this.localhost}/backend`; // Cambia a https si el servidor usa HTTPS
    if (!imagen) {
      console.error('Imagen no especificada');
      return '';
    }
    const imageUrl = `${baseUrl}/uploads/${imagen}`;
    return imageUrl;
  }
  detenerPropagacion(event: Event): void {
    event.stopPropagation();
  }

  verPublicacion(id?: number, creador?: number) {
    localStorage.removeItem('id_publicacion');
    localStorage.removeItem('id_creador');
    if (id !== undefined) {
      localStorage.setItem('id_publicacion', id.toString());
      console.log('ID seteada:', id);
    } else {
      console.error('ID no está definida');
    }
    if (creador !== undefined) {
      localStorage.setItem('id_creador', creador.toString());
      console.log('ID del creador seteada:', creador);
    } else {
      console.error('ID del creador no está definida');
    }
  }

  verUsuario(id_persona: number | undefined) {
    if (id_persona) {
      console.log(id_persona, 'AAAAAAAAAA');
      localStorage.setItem('id_usuario', id_persona.toString());
      this.router.navigate(['/inicio/porfile/', id_persona]);
    }
  }
}

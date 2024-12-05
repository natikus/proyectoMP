import { Component, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
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
    IonFooter,
    IonLabel,
    IonGrid,
    IonCol,
  ],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion = input<publicaciones | undefined>(undefined);
  showLink = input<boolean>(true);
  usuario = input<usuarios | undefined>(undefined);
  router: Router = inject(Router);
  verPublicacion(id?: number, creador?: number) {
    localStorage.removeItem('id_publicacion');
    localStorage.removeItem('id_creador');
    if (id !== undefined) {
      localStorage.setItem('id_publicacion', id.toString());
    } else {
      console.error('ID no está definida');
    }
    if (creador !== undefined) {
      localStorage.setItem('id_creador', creador.toString());
    } else {
      console.error('ID del creador no está definida');
    }
  }
  verUsuario(id_persona: number | undefined) {
    if (id_persona) {
      localStorage.setItem('id_usuario', id_persona.toString());
      this.router.navigate(['/inicio/porfile/', id_persona]);
    }
  }
}

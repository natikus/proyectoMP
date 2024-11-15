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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [
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
      this.router.navigate(['/inicio/porfile', id_persona]);
    }
  }
}

import { Component, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [
    IonCard,
    JsonPipe,
    RouterLink,
    IonImg,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonText,
    IonAvatar,
    IonItem,
    IonFooter,
  ],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion = input<publicaciones | undefined>(undefined);
  showLink = input<boolean>(true);
  usuario = input<usuarios | undefined>(undefined);
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
}

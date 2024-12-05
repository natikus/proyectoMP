import { Component, inject, OnInit } from '@angular/core';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones, publicacionId } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';

import { CommonModule } from '@angular/common';
import { amigo, usuarios } from '../../interface/persona';
import {
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [
    IonText,
    IonCard,
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    PublicacionComponent,
    CommonModule,
  ],
  templateUrl: './amigos.page.html',
  styleUrls: ['./amigos.page.scss'],
})
export class AmigosPage {
  constructor() {}

  apiService = inject(ApiRestService);
  publicacionesId: Array<publicacionId>[] = [];
  publicaciones: publicaciones[] = [];
  amigos: amigo[] = [];
  usuarios: usuarios[] = [];
  id_persona: string = '';
  recargar: boolean = true;

  async ngOnInit() {
    if (this.recargar) {
      localStorage.removeItem('id_usuario');
      localStorage.removeItem('id_publicacion');
      localStorage.removeItem('id_creador');

      this.id_persona = localStorage.getItem('id_persona') ?? '';
      this.amigos = await this.apiService.get(
        //obtengo los amigos
        `publicaciones/${this.id_persona}/amigos`
      );
      console.log('AMIGOSSS', this.amigos); //verifico que son todos
      for (const amigos of this.amigos) {
        try {
          console.log('publicaciones del amigo', amigos);
          const amigo = await this.apiService.get(
            `publicaciones/${amigos.id_amigo2}/persona` //obtengo las id publicaciones de cara persona
          );
          console.log('el amigo', amigos, 'tiene las publicaicones', amigo);
          this.publicacionesId.push(amigo);
        } catch {
          console.error('este amigo no tiene publicaciones');
        }
      }
      console.log('PUBLICACIONES A MOSTRAR', this.publicacionesId);
      for (const publicacion of this.publicacionesId) {
        try {
          for (const id of publicacion) {
            console.log('trayendo la publicacion', publicacion);
            const publicacionn = await this.apiService.get(
              `publicaciones/${id.id_publicacion}` //obtengo las publicaciones de cada persona
            );
            this.publicaciones.push(publicacionn);
          }
        } catch {
          console.log('no NDA');
        }
      }
      for (const publicacion of this.publicaciones) {
        const usuario = await this.creador(publicacion.id_creador);
        this.usuarios.push(usuario);
      }
      console.log(this.usuarios);
    }
  }

  verMiPerfil() {
    if (this.id_persona) {
      localStorage.setItem('id_usuario', this.id_persona);
    }
  }

  async creador(id: number): Promise<usuarios> {
    return await this.apiService.get(`usuario/${id}`);
  }
}

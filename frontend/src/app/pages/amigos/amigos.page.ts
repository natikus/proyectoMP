import { Component, inject, OnInit } from '@angular/core';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
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
  publicaciones: publicaciones[] = [];
  amigos: amigo[] = [];
  usuarios: usuarios[] = [];
  id_persona: string = '';
  recargar: boolean = true;

  async ngOnInit() {
    if (this.recargar) {
      localStorage.removeItem('id_usuario');
      localStorage.removeItem('id_publicacion');
      this.id_persona = localStorage.getItem('id_persona') ?? '';
      this.amigos = await this.apiService.get(
        `publicaciones/${this.id_persona}/amigos`
      );
      console.log('AMIGOSSS', this.amigos);
      for (const amigos of this.amigos) {
        console.log(amigos);
        const amigo = await this.apiService.get(
          `publicaciones/${amigos}/amigos`
        );
        this.publicaciones.push(amigo);
      }
      for (const publicacion of this.publicaciones) {
        const usuario = await this.creador(publicacion.id_creador);
        this.usuarios.push(usuario);
      }
      console.log(this.usuarios);

      localStorage.removeItem('id_creador');
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

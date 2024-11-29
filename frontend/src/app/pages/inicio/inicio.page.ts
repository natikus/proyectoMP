import { Component, inject } from '@angular/core';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { usuarios } from '../../interface/persona';
import {
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
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
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage {
  apiService = inject(ApiRestService);
  publicaciones: publicaciones[] = [];
  usuarios: usuarios[] = [];
  id_persona: string = '';

  // Se ejecuta cada vez que la página se muestra
  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  // Refactorizamos la lógica de carga de datos
  private async cargarDatos() {
    // Limpiar datos almacenados previamente
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('id_publicacion');
    this.publicaciones = await this.apiService.get('publicaciones');
    console.log(this.publicaciones);

    // Limpiar usuarios previos y cargar nuevos
    this.usuarios = [];
    for (const publicacion of this.publicaciones) {
      const usuario = await this.creador(publicacion.id_creador);
      this.usuarios.push(usuario);
    }
    console.log(this.usuarios);

    // Cargar el ID de la persona actual
    this.id_persona = localStorage.getItem('id_persona') ?? '';
    localStorage.removeItem('id_creador');
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

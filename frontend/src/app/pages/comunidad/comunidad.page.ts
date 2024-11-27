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
  selector: 'app-comunidad',
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
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
})
export class ComunidadPage {
  apiService = inject(ApiRestService);
  publicaciones: publicaciones[] = [];
  usuarios: usuarios[] = [];
  id_persona: string = '';
  recargar: boolean = true;

  async ngOnInit() {
    if (this.recargar) {
      localStorage.removeItem('id_usuario');
      localStorage.removeItem('id_publicacion');
      const comundidad = localStorage.getItem('id_comunidad');
      this.publicaciones = await this.apiService.get(
        `publicaciones/comunidades/${comundidad}`
      );
      console.log(this.publicaciones);
      for (const publicacion of this.publicaciones) {
        const usuario = await this.creador(publicacion.id_creador);
        this.usuarios.push(usuario);
      }
      console.log(this.usuarios);
      this.id_persona = localStorage.getItem('id_persona') ?? '';
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

import { Component, inject } from '@angular/core';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PublicacionComponent, RouterLink, CommonModule],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage {
  apiService = inject(ApiRestService);
  publicaciones: publicaciones[] = [];
  id_persona: string = '';
  async ngOnInit() {
    this.publicaciones = await this.apiService.get('publicaciones');
    this.id_persona = localStorage.getItem('id_persona') ?? '';
    localStorage.removeItem('id_creador');
    localStorage.removeItem('id_creador');
  }
  verMiPerfil() {
    if (this.id_persona) {
      localStorage.setItem('id_usuario', this.id_persona);
    }
  }
}

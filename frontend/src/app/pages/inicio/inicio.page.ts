import { Component, inject } from '@angular/core';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [PublicacionComponent, RouterLink],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage {
  apiService = inject(ApiRestService);
  publicaciones: publicaciones[] = [];
  async ngOnInit() {
    this.publicaciones = await this.apiService.get('publicaciones');
    localStorage.removeItem('id_publicacion');
  }
}

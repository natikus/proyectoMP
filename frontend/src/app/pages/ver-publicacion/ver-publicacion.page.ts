import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiRestService } from '../../servicios/api-rest.service';
import { publicaciones } from '../../interface/publicacion';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ver-publicacion',
  standalone: true,
  imports: [PublicacionComponent, RouterLink, CommonModule, DatePipe],
  templateUrl: './ver-publicacion.page.html',
  styleUrl: './ver-publicacion.page.css',
})
export class VerPublicacionPage {
  apiService = inject(ApiRestService);
  publicacion!: publicaciones;
  id!: string;
  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID de la publicación:', this.id);

    this.publicacion = await this.apiService.get(`publicaciones/${this.id}`);
  }
}

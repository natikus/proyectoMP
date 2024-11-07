import { Component, inject } from '@angular/core';
import { usuarios } from '../../interface/persona';
import { ApiRestService } from '../../servicios/api-rest.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-perfil-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-card.component.html',
  styleUrls: ['./perfil-card.component.scss'],
})
export class PerfilCardComponent {
  apiService = inject(ApiRestService);
  usuario!: usuarios;
  id!: string;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit(): Promise<void> {
    const id_usuario = localStorage.getItem('id_usuario');
    console.log('ID del usuario:', id_usuario);

    this.usuario = await this.apiService.get(`usuario/${id_usuario}`);
  }
}

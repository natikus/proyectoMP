import { Component, inject } from '@angular/core';
import { usuarioVirtual } from '../../interface/persona';
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
  usuario!: usuarioVirtual;
  id!: string;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('ID del usuario:', this.id);

    this.usuario = await this.apiService.get(`usuario/${this.id}`);
  }
}

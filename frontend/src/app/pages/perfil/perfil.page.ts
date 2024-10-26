import { Component, inject } from '@angular/core';
import { usuarioVirtual } from '../../interface/persona';
import { ApiRestService } from '../../servicios/api-rest.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css',
})
export class PerfilPage {
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

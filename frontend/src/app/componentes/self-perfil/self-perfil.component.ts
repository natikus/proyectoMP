import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRestService } from '../../servicios/api-rest.service';
import { usuarios } from '../../interface/persona';
import { CommonModule } from '@angular/common';
import { PublicacionComponent } from '../publicacion/publicacion.component';
import { publicaciones } from '../../interface/publicacion';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-self-perfil',
  standalone: true,
  imports: [CommonModule, PublicacionComponent, RouterLink],
  templateUrl: './self-perfil.component.html',
  styleUrls: ['./self-perfil.component.scss'],
})
export class SelfPerfilComponent implements OnInit {
  apiService = inject(ApiRestService);
  publicaciones: publicaciones[] = [];
  usuario!: usuarios;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit(): Promise<void> {
    const id_usuario = localStorage.getItem('id_usuario');
    console.log('ID del usuario:', id_usuario);
    this.publicaciones = await this.apiService.get(
      `usuario/${id_usuario}/publicaciones`
    );
    this.usuario = await this.apiService.get(`usuario/${id_usuario}`);
  }
  editarme() {
    console.log('primero desarrollalo');
  }
}

import { Component } from '@angular/core';
import { PerfilCardComponent } from '../../componentes/perfil-card/perfil-card.component';
import { CommonModule } from '@angular/common';
import { SelfPerfilComponent } from '../../componentes/self-perfil/self-perfil.component';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [PerfilCardComponent, CommonModule, SelfPerfilComponent],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css',
})
export class PerfilPage {
  usuario: string = localStorage.getItem('id_persona') ?? '';
  perfil: string = localStorage.getItem('id_usuario') ?? '';

  async ngOnInit() {
    localStorage.removeItem('id_publicacion');
    localStorage.removeItem('id_creador');
  }
}

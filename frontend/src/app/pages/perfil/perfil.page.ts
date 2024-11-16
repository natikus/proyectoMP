import { Component } from '@angular/core';
import { PerfilCardComponent } from '../../componentes/perfil-card/perfil-card.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [PerfilCardComponent],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css',
})
export class PerfilPage {
 

  async ngOnInit() {
    localStorage.removeItem('id_publicacion');
    localStorage.removeItem('id_creador');
  }
}

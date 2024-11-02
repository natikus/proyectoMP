import { Component } from '@angular/core';
import { PerfilCardComponent } from '../../componentes/perfil-card/perfil-card.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [PerfilCardComponent],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css',
})
export class PerfilPage {}

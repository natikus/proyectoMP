import { Component } from '@angular/core';
import { PublicacionCardComponent } from '../../componentes/publicacion-card/publicacion-card.component';

@Component({
  selector: 'app-ver-publicacion',
  standalone: true,
  imports: [PublicacionCardComponent],
  templateUrl: './ver-publicacion.page.html',
  styleUrl: './ver-publicacion.page.css',
})
export class VerPublicacionPage {}

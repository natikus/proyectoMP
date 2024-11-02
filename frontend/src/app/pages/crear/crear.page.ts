import { Component } from '@angular/core';
import { CrearPublicacionComponent } from '../../componentes/crear-publicacion/crear-publicacion.component';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CrearPublicacionComponent],
  templateUrl: './crear.page.html',
  styleUrl: './crear.page.css',
})
export class CrearPage {}

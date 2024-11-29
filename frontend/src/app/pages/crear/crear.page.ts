import { Component } from '@angular/core';
import { CrearPublicacionComponent } from '../../componentes/crear-publicacion/crear-publicacion.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [IonContent, CrearPublicacionComponent],
  templateUrl: './crear.page.html',
  styleUrl: './crear.page.css',
})
export class CrearPage {}

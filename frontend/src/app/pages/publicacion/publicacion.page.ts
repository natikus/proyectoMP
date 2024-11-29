import { Component } from '@angular/core';
import { PublicacionCardComponent } from '../../componentes/publicacion-card/publicacion-card.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ver-publicacion',
  standalone: true,
  imports: [IonContent, PublicacionCardComponent],
  templateUrl: './publicacion.page.html',
  styleUrl: './publicacion.page.css',
})
export class VerPublicacionPage {}

import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { publicaciones } from '../../interface/publicacion';
@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion = input<publicaciones | undefined>(undefined);
  showLink = input<boolean>(true);
}

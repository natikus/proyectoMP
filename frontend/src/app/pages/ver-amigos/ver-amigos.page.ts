import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ApiRestService } from '../../servicios/api-rest.service';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonTitle,
  IonCard,
  IonText,
  IonInput,
} from '@ionic/angular/standalone';
import { publicaciones } from '../../interface/publicacion';
import { CommonModule } from '@angular/common';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { amigo } from '../../interface/persona';

@Component({
  selector: 'app-ver-amigos',
  standalone: true,
  imports: [
    IonText,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    FormsModule,
    IonButton,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './ver-amigos.page.html',
  styleUrls: ['./ver-amigos.page.scss'],
})
export class VerAmigosPage {
  private apiService: ApiRestService = inject(ApiRestService);
  id_persona = localStorage.getItem('id_persona');
  amigos: amigo[] = [];
  async ngOnInit() {
    this.amigos = await this.apiService.get(
      //obtengo los amigos
      `publicaciones/${this.id_persona}/amigos`
    );
  }
}

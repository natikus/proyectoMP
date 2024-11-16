import { Component, inject } from '@angular/core';
import { usuarios } from '../../interface/persona';
import { ApiRestService } from '../../servicios/api-rest.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonImg,
  IonCol,
  IonRow,
  IonGrid,
  IonButton,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-perfil-card',
  standalone: true,
  imports: [IonButton, IonImg, CommonModule, IonText, IonRow, IonCol],
  templateUrl: './perfil-card.component.html',
  styleUrls: ['./perfil-card.component.scss'],
})
export class PerfilCardComponent {
  apiService = inject(ApiRestService);
  usuario: usuarios = {
    nombre: '',
    apellido: '',
    id_persona: 0,
    usuario: '',
    email: '',
    imagen: '',
    is_Admin: false,
    descripcion: '',
    intereses: [],
    contrasena: '',
    telefono: '',
  };
  id!: string;
  sos: boolean = false;
  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const id_usuario = localStorage.getItem('id_usuario');
    console.log('ID del usuario:', id_usuario);

    if (id_usuario) {
      try {
        this.usuario = await this.apiService.get(`usuario/${id_usuario}`);
        console.log('USUARIO:', this.usuario);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    }
  }
}

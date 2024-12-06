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
import { usuarios } from '../../interface/persona';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-amigo',
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
  templateUrl: './buscar-amigo.page.html',
  styleUrls: ['./buscar-amigo.page.scss'],
})
export class BuscarAmigoPage {
  buscado: string = '';
  filtrados: publicaciones[] = [];
  usuarios: usuarios[] = [];
  private apiService: ApiRestService = inject(ApiRestService);
  busquedaRealizada: boolean = false;
  id_persona = localStorage.getItem('id_persona');
  usuariosPosteados!: { id_amigo1: number; id_amigo2: number };
  router: Router = inject(Router);

  async buscar() {
    console.log('Valor de buscado:', this.buscado); // Verifica si el valor se guarda

    // Limpiar resultados previos
    this.filtrados = [];
    this.usuarios = [];

    const resultados = await this.apiService.get(`usuario`);

    // Verificar los resultados de la API
    console.log('Resultados de la API:', resultados);

    for (let resultado of resultados) {
      if (
        resultado != '' &&
        resultado.email.toLowerCase().includes(this.buscado.toLowerCase()) //si coinide
      ) {
        console.log(resultado, 'RESULTADOO');
        console.log(resultado.id_persona, 'ID PERSONA BUSCADA');
        console.log(this.id_persona, 'ID PERSONA LOGEADA');
        console.log(this.usuariosPosteados);
        if (this.id_persona)
          this.usuariosPosteados = {
            id_amigo1: resultado.id_persona,
            id_amigo2: parseInt(this.id_persona),
          };
        console.log(this.usuariosPosteados, 'NOT NULLLLL');

        const solicitud = await this.apiService.post(
          `usuario/${this.id_persona}/amigo`,
          this.usuariosPosteados
        );
        console.log(solicitud);
        if (solicitud) {
          window.alert('Amigo añadido');
          this.router.navigate(['/inicio']);
        } else {
          window.alert('Usuario no encontrado ');
        }
      }
    }

    this.busquedaRealizada = true;

    // Verificar si los resultados fueron filtrados correctamente
    console.log('Publicaciones filtradas:', this.filtrados);
    console.log('Usuarios asociados:', this.usuarios);
  }
}

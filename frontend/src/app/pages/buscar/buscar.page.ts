import { Component, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { ValidatorsService } from '../../servicios/validators.service';

import { ApiRestService } from '../../servicios/api-rest.service';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
  IonCard,
} from '@ionic/angular/standalone';
import { publicaciones } from '../../interface/publicacion';
import { CommonModule } from '@angular/common';
import { PublicacionComponent } from '../../componentes/publicacion/publicacion.component';
import { usuarios } from '../../interface/persona';
@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule,
    IonButton,
    IonList,
    IonTitle,
    IonHeader,
    IonToolbar,
    CommonModule,
    PublicacionComponent,
  ],
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage {
  buscado: string = '';
  filtrados: publicaciones[] = [];
  usuarios: usuarios[] = [];
  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);
  async buscar() {
    const resultados = await this.apiService.get('publicaciones');

    resultados.forEach(async (resultado: publicaciones) => {
      // Compara si el título o la descripción contienen la cadena buscada (sin importar mayúsculas o minúsculas)
      if (
        resultado.titulo.toLowerCase().includes(this.buscado.toLowerCase()) ||
        resultado.descripcion.toLowerCase().includes(this.buscado.toLowerCase())
      ) {
        // Verifica si el resultado ya existe en `filtrados` antes de añadirlo
        const existe = this.filtrados.some(
          (filtrado) => filtrado.id_publicacion === resultado.id_publicacion
        );

        if (!existe) {
          this.filtrados.push(resultado); // Agrega el resultado a la lista filtrada

          // Busca el usuario asociado si la publicación es nueva en `filtrados`
          const usuario = await this.apiService.get(
            `usuario/${resultado.id_creador}`
          );

          this.usuarios.push(usuario);
        }
      }
    });

    console.log(this.filtrados);
    console.log(this.usuarios);
  }
}

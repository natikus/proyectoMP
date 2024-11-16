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

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [
    IonText,
    IonCard,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    FormsModule,
    IonButton,
    IonTitle,
    CommonModule,
    PublicacionComponent,
    FormsModule,
  ],
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage {
  buscado: string = '';
  filtrados: publicaciones[] = [];
  usuarios: usuarios[] = [];
  private apiService: ApiRestService = inject(ApiRestService);
  busquedaRealizada: boolean = false;

  async buscar() {
    console.log('Valor de buscado:', this.buscado); // Verifica si el valor se guarda

    // Limpiar resultados previos
    this.filtrados = [];
    this.usuarios = [];

    const resultados = await this.apiService.get('publicaciones');

    // Verificar los resultados de la API
    console.log('Resultados de la API:', resultados);

    for (let resultado of resultados) {
      if (
        resultado.titulo.toLowerCase().includes(this.buscado.toLowerCase()) ||
        resultado.descripcion.toLowerCase().includes(this.buscado.toLowerCase())
      ) {
        // Filtrar las publicaciones que coinciden
        this.filtrados = [...this.filtrados, resultado];

        // Obtener el usuario asociado a la publicación
        const usuario = await this.apiService.get(
          `usuario/${resultado.id_creador}`
        );
        this.usuarios = [...this.usuarios, usuario];
      }
    }

    this.busquedaRealizada = true;

    // Verificar si los resultados fueron filtrados correctamente
    console.log('Publicaciones filtradas:', this.filtrados);
    console.log('Usuarios asociados:', this.usuarios);
  }
}

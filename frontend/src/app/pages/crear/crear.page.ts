import { Component, inject } from '@angular/core';
import { publicaciones } from '../../interface/publicacion';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiRestService } from '../../servicios/api-rest.service';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatError,
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './crear.page.html',
  styleUrl: './crear.page.css',
})
export class CrearPage {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  formGroup = this._formBuilder.group({
    titulo: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
    descripcion: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],

    imagenes: ['', Validators.required],
    ubicacion: ['', [Validators.required, Validators.email]],
    etiquetas: ['', Validators.required],
  });
  private apiService: ApiRestService = inject(ApiRestService);
  selectedFile: File | null = null;
  etiquetasDisponibles: string[] = [];
  etiquetasSeleccionados: string[] = [];
  mostrarEtiquetas = false;
  private router: Router = inject(Router);
  ngOnInit() {
    this.getEtiqueta(); // Obtén los intereses
    this.formGroup.get('intereses')?.valueChanges.subscribe(() => {
      this.filtrarEtiquetas(); // Filtra intereses en base al input
    });
  }

  private async getEtiqueta() {
    try {
      const etiquetas = await this.apiService.get('publicaciones/etiquetas');
      console.log('Respuesta completa de la API:', etiquetas);
      this.etiquetasDisponibles = Array.isArray(etiquetas) ? etiquetas : [];
    } catch (error) {
      console.error('Error al obtener las etiquetas:', error);
    }
  }

  filtrarEtiquetas(): void {
    console.log('Etiquetas disponibles:', this.etiquetasDisponibles);

    const valorInput = (
      this.formGroup.get('etiquetas')?.value || ''
    ).toLowerCase();

    // Si no hay valor en el input, limpiar las sugerencias
    if (!valorInput) {
      // Si quieres limpiar la lista solo al borrar el texto, puedes descomentar la siguiente línea
      // this.interesesDisponibles = [];
      return;
    }

    // Filtra los intereses disponibles según el valor del input
    this.etiquetasDisponibles = this.etiquetasDisponibles.filter((interes) =>
      interes.toLowerCase().includes(valorInput)
    );

    // Si no hay coincidencias y el input no está vacío, puedes agregar el nuevo interés
    if (valorInput && !this.etiquetasDisponibles.length) {
      this.agregarEtiqueta(valorInput);
    }
  }

  async agregarEtiqueta(etiqueta: string) {
    const result = await this.apiService.post(
      'publicaciones/etiqueta',
      etiqueta
    );
    if (result) {
      console.log('Interés agregado:', result);
      await this.getEtiqueta(); // Vuelve a cargar los intereses después de agregar
    }
  }

  seleccionarEtiquetas(interes: string) {
    if (!this.etiquetasSeleccionados.includes(interes)) {
      this.etiquetasSeleccionados.push(interes);
      // Limpiar el campo de texto sin actualizar el control del formulario
      // this.formGroup.get('intereses')?.setValue(''); // No actualices el valor del formulario
    }
    // No ocultamos la lista después de seleccionar, para permitir más selecciones
  }

  eliminarEtiqueta(interes: string) {
    // Filtramos la lista para que solo queden los elementos que no coinciden con el interés seleccionado
    this.etiquetasSeleccionados = this.etiquetasSeleccionados.filter(
      (i) => i !== interes
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  async clickRegister(): Promise<void> {
    console.log('Verificando información');
    if (this.formGroup.valid) {
      const formData = new FormData();
      const etiquetas = this.etiquetasSeleccionados; // Usa los intereses seleccionados

      // Agregar los valores del formulario
      formData.append('titulo', this.formGroup.get('titulo')?.value || '');
      formData.append(
        'descripcion',
        this.formGroup.get('descripcion')?.value || ''
      );
      formData.append('imagenes', this.formGroup.get('imagenes')?.value || '');
      formData.append(
        'ubicacion',
        this.formGroup.get('ubicacion')?.value || ''
      );

      // Aquí se agregan los intereses seleccionados como JSON
      if (etiquetas.length > 0) {
        formData.append('etiquetas', JSON.stringify(etiquetas));
      } else {
        console.error('No se han seleccionado etiquetas.');
      }

      // Añadir la imagen seleccionada al FormData
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      try {
        const response = await this.apiService.postPublicacion(formData);
        console.log(response);
        this.apiService.setToken(response.token);
        this.router.navigate(['/inicio']);
      } catch (error) {
        console.error('Error al crear la publicacion:', error);
      }
    } else {
      // Mostrar los errores de validación en consola
      Object.keys(this.formGroup.controls).forEach((key) => {
        const controlErrors = this.formGroup.get(key)?.errors;
        if (controlErrors) {
          console.log(`Error en ${key}: `, controlErrors);
        }
      });
    }
  }
  get titulo(): FormControl<string> {
    return this.formGroup.controls.titulo;
  }
  get descripcion(): FormControl<string> {
    return this.formGroup.controls.descripcion;
  }
  get imagenes(): FormControl<string> {
    return this.formGroup.controls.imagenes;
  }
  get ubicacion(): FormControl<string> {
    return this.formGroup.controls.ubicacion;
  }
  get etiquetas(): FormControl<string> {
    return this.formGroup.controls.etiquetas;
  }
}

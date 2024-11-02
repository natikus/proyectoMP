import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  PasswordStateMatcher,
  crossPasswordMatchingValidatior,
  customPasswordValidator,
} from './register-costum-validators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatFormFieldModule,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.css'],
})
export class RegistroPage implements OnInit {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  passwordStateMatcher = new PasswordStateMatcher();
  formGroup = this._formBuilder.group(
    {
      usuario: ['', Validators.required],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [customPasswordValidator, Validators.required]],
      confirmContrasena: ['', Validators.required],
      descripcion: ['', Validators.required],
      intereses: ['', Validators.required],
    },
    {
      validators: crossPasswordMatchingValidatior,
    }
  );

  private apiService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  selectedFile: File | null = null;
  interesesDisponibles: string[] = [];
  interesesSeleccionados: string[] = [];
  mostrarIntereses = false;

  ngOnInit() {
    this.getIntereses(); // Obtén los intereses
    this.formGroup.get('intereses')?.valueChanges.subscribe(() => {
      this.filtrarIntereses(); // Filtra intereses en base al input
    });
  }

  private async getIntereses() {
    try {
      const intereses = await this.apiService.getIntereses();
      this.interesesDisponibles = intereses; // Debería ser un array de strings
      console.log('Intereses disponibles:', this.interesesDisponibles.flat());
    } catch (error) {
      console.error('Error al obtener los intereses:', error);
    }
  }

  filtrarIntereses(): void {
    console.log('Intereses disponibles:', this.interesesDisponibles);

    const valorInput = (
      this.formGroup.get('intereses')?.value || ''
    ).toLowerCase();

    // Si no hay valor en el input, limpiar las sugerencias
    if (!valorInput) {
      // Si quieres limpiar la lista solo al borrar el texto, puedes descomentar la siguiente línea
      // this.interesesDisponibles = [];
      return;
    }

    // Filtra los intereses disponibles según el valor del input
    this.interesesDisponibles = this.interesesDisponibles.filter((interes) =>
      interes.toLowerCase().includes(valorInput)
    );

    // Si no hay coincidencias y el input no está vacío, puedes agregar el nuevo interés
    if (valorInput && !this.interesesDisponibles.length) {
      this.agregarInteres(valorInput);
    }
  }

  async agregarInteres(interes: string) {
    const result = await this.apiService.postIntereses(interes);
    if (result) {
      console.log('Interés agregado:', result);
      await this.getIntereses(); // Vuelve a cargar los intereses después de agregar
    }
  }

  seleccionarInteres(interes: string) {
    if (!this.interesesSeleccionados.includes(interes)) {
      this.interesesSeleccionados.push(interes);
      // Limpiar el campo de texto sin actualizar el control del formulario
      // this.formGroup.get('intereses')?.setValue(''); // No actualices el valor del formulario
    }
    // No ocultamos la lista después de seleccionar, para permitir más selecciones
  }

  eliminarInteres(interes: string) {
    // Filtramos la lista para que solo queden los elementos que no coinciden con el interés seleccionado
    this.interesesSeleccionados = this.interesesSeleccionados.filter(
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
      const intereses = this.interesesSeleccionados; // Usa los intereses seleccionados

      // Agregar los valores del formulario
      formData.append('usuario', this.formGroup.get('usuario')?.value || '');
      formData.append('nombre', this.formGroup.get('nombre')?.value || '');
      formData.append('apellido', this.formGroup.get('apellido')?.value || '');
      formData.append('telefono', this.formGroup.get('celular')?.value || '');
      formData.append('email', this.formGroup.get('email')?.value || '');
      formData.append(
        'contrasena',
        this.formGroup.get('contrasena')?.value || ''
      );
      formData.append(
        'descripcion',
        this.formGroup.get('descripcion')?.value || ''
      );

      // Aquí se agregan los intereses seleccionados como JSON
      if (intereses.length > 0) {
        formData.append('intereses', JSON.stringify(intereses));
      } else {
        console.error('No se han seleccionado intereses.');
      }

      // Añadir la imagen seleccionada al FormData
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      try {
        const response = await this.apiService.register('', formData);
        console.log(response);
        this.apiService.setToken(response.token);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error en el registro:', error);
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

  get Usuario(): FormControl<string> {
    return this.formGroup.controls.usuario;
  }
  get Nombre(): FormControl<string> {
    return this.formGroup.controls.nombre;
  }
  get Apellido(): FormControl<string> {
    return this.formGroup.controls.apellido;
  }
  get Celular(): FormControl<string> {
    return this.formGroup.controls.celular;
  }
  get Email(): FormControl<string> {
    return this.formGroup.controls.email;
  }
  get Contrasena(): FormControl<string> {
    return this.formGroup.controls.contrasena;
  }
  get ConfirmContrasena(): FormControl<string> {
    return this.formGroup.controls.confirmContrasena;
  }
  get Intereses(): FormControl<string> {
    return this.formGroup.controls.intereses;
  }
  get Descripcion(): FormControl<string> {
    return this.formGroup.controls.descripcion;
  }
}

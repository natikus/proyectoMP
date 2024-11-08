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
  selector: 'app-registro-form',
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
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.scss'],
})
export class RegistroFormComponent implements OnInit {
  //declaracion del fromGrup
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
  //logica de intereses
  availableInterestsList: string[] = [];
  selectedInterests: string[] = [];
  showInterestsList = false;

  ngOnInit() {
    this.loadInterests();
  }
  async loadInterests() {
    const intereses = await this.apiService.getIntereses();
    this.availableInterestsList = intereses;
  }

  get availableInterests(): string[] {
    return this.availableInterestsList.filter(
      (interest) => !this.selectedInterests.includes(interest)
    );
  }

  toggleInterestsList() {
    this.showInterestsList = !this.showInterestsList;
  }

  selectInterest(interest: string) {
    this.selectedInterests.push(interest);
    this.updateInteresesControl();
    this.showInterestsList = false;
  }

  removeInterest(interest: string) {
    this.selectedInterests = this.selectedInterests.filter(
      (i) => i !== interest
    );
    this.updateInteresesControl();
  }
  private updateInteresesControl() {
    // Actualizar el control 'intereses' con los intereses seleccionados en formato de texto
    this.formGroup
      .get('intereses')
      ?.setValue(JSON.stringify(this.selectedInterests));
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

      // Agregar intereses seleccionados como JSON
      if (this.selectedInterests.length > 0) {
        formData.append('intereses', JSON.stringify(this.selectedInterests));
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

        if (response && response.token) {
          this.apiService.setToken(response.token);
          this.router.navigate(['auth/login']);
        } else {
          console.error(
            'Error en el registro: Token no encontrado en la respuesta'
          );
        }
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

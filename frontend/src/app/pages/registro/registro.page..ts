import { Component, inject } from '@angular/core';
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
import { ApiRestService } from '../../servicios/api-rest.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { usuarioVirtual } from '../../interface/persona';
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
  templateUrl: './registro.page..html',
  styleUrl: './registro.page..css',
})
export class RegistroPage {
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
      //celular: ['', Validators.required],
      //foto: '',
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [customPasswordValidator, Validators.required]],
      confirmContrasena: ['', Validators.required],
      descripcion: ['', Validators.required],
      intereses: [[''], [Validators.required, Validators.minLength(2)]],
    },
    {
      validators: crossPasswordMatchingValidatior,
    }
  );
  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);
  async clickRegister(): Promise<void> {
    console.log('verificando informacion');
    if (this.formGroup.valid) {
      const usuarioVirtual = {
        nombre: this.Nombre,
        apellido: this.Apellido,
        usuario: this.Usuario,
        email: this.Email,
        //       foto: this.Foto,
        descripcion: this.Descripcion,
        intereses: this.Intereses,
        contrasena: this.Contrasena,
      };

      const sent = await this.apiService.post(
        'auth',
        JSON.stringify(this.formGroup.value)
      );
      console.log(sent);
      this.apiService.setToken(sent.token);
      console.log(sent.usuario);
      this.router.navigate(['/login']);
    } else {
      {
        Object.keys(this.formGroup.controls).forEach((key) => {
          const controlErrors = this.formGroup.get(key)?.errors;
          if (controlErrors) {
            console.log(`Error en ${key}: `, controlErrors);
          }
        });
      }
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
  /*get Celular(): FormControl<string> {
    return this.formGroup.controls.celular;
  }*/
  /*get Foto(): FormControl<string> {
    return this.formGroup.controls.foto;
  }*/

  get Email(): FormControl<string> {
    return this.formGroup.controls.email;
  }

  get Contrasena(): FormControl<string> {
    return this.formGroup.controls.contrasena;
  }

  get confirmContrasena(): FormControl<string> {
    return this.formGroup.controls.confirmContrasena;
  }
  get Intereses(): FormControl<string[]> {
    return this.formGroup.controls.intereses;
  }
  get Descripcion(): FormControl<string> {
    return this.formGroup.controls.descripcion;
  }
}

/*import { Component, inject } from '@angular/core';
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
import { ApiRestService } from '../../servicios/api-rest.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { usuarioVirtual } from '../../interface/persona';
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
  templateUrl: './registro.page..html',
  styleUrl: './registro.page..css',
})
export class RegistroPage {
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
      imagen: '',
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
  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);
  async clickRegister(): Promise<void> {
    console.log('verificando informacion');
    if (this.formGroup.valid) {
      console.log('el formulario es valido');
      const formData = new FormData();
      formData.append('usuario', this.formGroup.get('usuario')?.value || '');
      formData.append('nombre', this.formGroup.get('nombre')?.value || '');
      formData.append('apellido', this.formGroup.get('apellido')?.value || '');
      formData.append('email', this.formGroup.get('email')?.value || '');
      formData.append(
        'contrasena',
        this.formGroup.get('contrasena')?.value || ''
      );
      formData.append('imagen', 'imagen.jpg');
      formData.append(
        'descripcion',
        this.formGroup.get('descripcion')?.value || ''
      );
      formData.append(
        'intereses',
        this.formGroup.get('intereses')?.value || ''
      );

      const sent = await this.apiService.postPublicacion('auth', formData);
      console.log(sent);
      this.apiService.setToken(sent.token);
      console.log(sent.usuario);
      this.router.navigate(['/login']);
    } else {
      {
        Object.keys(this.formGroup.controls).forEach((key) => {
          const controlErrors = this.formGroup.get(key)?.errors;
          if (controlErrors) {
            console.log(`Error en ${key}: `, controlErrors);
          }
        });
      }
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
  get imagen(): FormControl<string> {
    return this.formGroup.controls.imagen;
  }

  get Email(): FormControl<string> {
    return this.formGroup.controls.email;
  }

  get Contrasena(): FormControl<string> {
    return this.formGroup.controls.contrasena;
  }

  get confirmContrasena(): FormControl<string> {
    return this.formGroup.controls.confirmContrasena;
  }
  get Intereses(): FormControl<string> {
    return this.formGroup.controls.intereses;
  }
  get Descripcion(): FormControl<string> {
    return this.formGroup.controls.descripcion;
  }
}
*/

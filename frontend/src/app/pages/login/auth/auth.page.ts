import { ApiRestService } from '../../../servicios/api-rest.service';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { createValidator } from './asyncValidators';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ValidatorsService } from '../../../servicios/validators.service';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
    MatError,
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.css',
})
export class AuthPage {
  private validatorsService = inject(ValidatorsService);
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  loginForm = this._formBuilder.group({
    email: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [createValidator(this.validatorsService)],
      },
    ],
    contrasena: ['', Validators.required],
  });
  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);
  async clickRegister(): Promise<void> {
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('email')?.value);
      console.log(this.loginForm.get('contrasena')?.value);
      const sent = await this.apiService.post('auth/login', {
        email: this.loginForm.get('email')?.value,
        contrasena: this.loginForm.get('contrasena')?.value,
      });
      console.log(sent);
      this.apiService.setToken(sent.token);
      localStorage.setItem('id_persona', sent.usuario.id_persona);
      console.log(sent.usuario);
      this.router.navigate(['/inicio']);
    } else {
      console.log('hay problemas en el formulario');
    }
  }
  get Contrasena(): FormControl<string> {
    return this.loginForm.controls.contrasena;
  }
  get Email(): FormControl<string> {
    return this.loginForm.controls.email;
  }
}

import { ApiRestService } from '../../../servicios/api-rest.service';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { createValidator } from './asyncValidators';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ValidatorsService } from '../../../servicios/validators.service';
import {
  IonButton,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonNote,
  IonCardContent,
  IonCard,
  IonInput,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonRow,
    IonCol,
    IonNote,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  ngOnInit() {
    localStorage.clear();
    console.log('localStroage limiado');
    try {
      this.GoogleLogin();
    } catch {
      console.log('No tienes autorizado el login con google');
    }
  }
  async clickRegister(): Promise<void> {
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('email')?.value);
      console.log(this.loginForm.get('contrasena')?.value);
      const sent = await this.apiService.post('auth/login', {
        email: this.loginForm.get('email')?.value,
        contrasena: this.loginForm.get('contrasena')?.value,
      });
      console.log(sent);
      localStorage.clear();
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
  async GoogleLogin() {
    console.log('Verificando si hay datos de Google en la URL...');
    try {
      const { user, token } = await this.getGoogleInfo();
      if (user && token) {
        console.log('Datos de Google obtenidos:', { user, token });
        this.authService.loginGoogle(user, token);
        document.dispatchEvent(new Event('authChanged'));
        console.log('LOCALLLL', localStorage);
      } else {
        console.error(
          'No se encontraron parámetros "user" o "token" en la URL'
        );
      }
    } catch {
      console.error('Login fallido:');
    }
  }

  async getGoogleInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    const token = urlParams.get('token');
    console.log('Parámetros obtenidos:', { user, token });
    return { user, token };
  }
}

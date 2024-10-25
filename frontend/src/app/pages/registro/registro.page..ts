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
      names: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [customPasswordValidator, Validators.required]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: crossPasswordMatchingValidatior,
    }
  );
  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);
  async clickRegister(): Promise<void> {
    if (this.formGroup.valid) {
      const sent = await this.apiService.post(
        'auth',
        JSON.stringify(this.formGroup)
      );
      console.log(sent);
      this.apiService.setToken(sent.token);
      console.log(sent.usuario);
      this.router.navigate(['/login']);
    }
  }
  get firtsField(): FormControl<string> {
    return this.formGroup.controls.names;
  }

  get lastNameField(): FormControl<string> {
    return this.formGroup.controls.lastName;
  }

  get emailField(): FormControl<string> {
    return this.formGroup.controls.email;
  }

  get passwordField(): FormControl<string> {
    return this.formGroup.controls.password;
  }

  get confirmPasswordField(): FormControl<string> {
    return this.formGroup.controls.confirmPassword;
  }
}

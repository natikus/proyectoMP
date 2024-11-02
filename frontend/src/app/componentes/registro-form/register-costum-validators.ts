import {
  AbstractControl,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

const patternPassword = new RegExp(
  '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8}'
);

export const customPasswordValidator = (
  control: AbstractControl<string>
): ValidationErrors | null => {
  const value = control.value;

  if (!patternPassword.test(value)) {
    return { customPasswordValidator: true };
  }

  return null;
};

export const crossPasswordMatchingValidatior: ValidatorFn = (
  formGroupControl: AbstractControl<{
    contrasena: string;
    confirmContrasena: string;
  }>
): ValidationErrors | null => {
  const password = formGroupControl.value.contrasena;
  const confirmPassword = formGroupControl.value.confirmContrasena;

  return password !== confirmPassword
    ? { crossConfirmPasswordError: true }
    : null;
};

export class PasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    if (!control || !control.parent) {
      return false;
    }
    return control.parent.hasError('crossConfirmPasswordError');
  }
}

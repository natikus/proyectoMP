import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ValidatorsService } from '../../../servicios/validators.service';
import { map } from 'rxjs/operators';
export const createValidator = (
  service: ValidatorsService
): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    console.log(control.value);
    return service.getUsuarioPorEmail(control.value).pipe(
      map((user) => {
        return user ? null : { usuarioNoRegistrado: true };
      })
    );
  };
};

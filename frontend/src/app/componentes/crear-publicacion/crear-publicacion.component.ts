import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-crear-publicacion',
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
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.scss'],
})
export class CrearPublicacionComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: [null, Validators.required],
      ubicacion: ['', Validators.required],
      etiquetas: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ imagen: file });
    this.form.get('imagen')?.updateValueAndValidity();
  }
}

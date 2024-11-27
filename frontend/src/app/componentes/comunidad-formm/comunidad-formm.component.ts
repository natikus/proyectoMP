import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { ApiRestService } from '../../servicios/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonInput,
  IonNote,
  IonRow,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-comunidad-formm',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './comunidad-formm.component.html',
  styleUrls: ['./comunidad-formm.component.scss'],
})
export class ComunidadFormmComponent {
  router: Router = inject(Router);
  apiService: ApiRestService = inject(ApiRestService);
  Loginform: FormGroup;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.Loginform = this.fb.group({
      comunidad: ['', Validators.required],
    });
  }

  async save() {
    try {
      const formData = new FormData();
      console.log('COMUNIDAAAD', this.Loginform.get('comunidad')?.value || '');
      formData.append(
        'comunidad',
        this.Loginform.get('comunidad')?.value || ''
      );
      const comunidad = await this.apiService.post(`comunidades`, formData);
      console.log('Etiquetas enviadas', comunidad);
      this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error al guardar la publicación:', error);
    }
  }

  onSubmit() {
    if (this.Loginform.valid) {
      console.log('Formulario enviado:', this.Loginform.value);
      this.save();
    }
  }

  salir() {
    this.router.navigate(['/inicio']);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  crossPasswordMatchingValidatior,
  customPasswordValidator,
  PasswordStateMatcher,
} from '../registro-form/register-costum-validators';
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
import { CommonModule } from '@angular/common';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes-form',
  standalone: true,
  imports: [
    IonRow,
    IonButton,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    FormsModule,
    IonNote,
    CommonModule,
    ReactiveFormsModule,
    ImageCropperComponent,
    IonInput,
  ],
  templateUrl: './ajustes-form.component.html',
  styleUrls: ['./ajustes-form.component.scss'],
})
export class AjustesFormComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  private _imageBlob: Blob | null | undefined = undefined;
  onChange = (image: Blob) => {};
  onTouched = () => {};
  constructor(private sanitizer: DomSanitizer) {}
  private apiService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  //logica de intereses
  availableInterestsList: string[] = [];
  selectedInterests: string[] = [];
  showInterestsList = false;

  private readonly _formBuilder = inject(NonNullableFormBuilder);
  passwordStateMatcher = new PasswordStateMatcher();
  updateForm = this._formBuilder.group(
    {
      usuario: '',
      celular: '',
      contrasena: ['', [customPasswordValidator, Validators.required]],
      confirmContrasena: ['', Validators.required],
      descripcion: '',
      intereses: '',
    },
    {
      validators: crossPasswordMatchingValidatior,
    }
  );
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
    this.updateForm
      .get('intereses')
      ?.setValue(JSON.stringify(this.selectedInterests));
  }
  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl != undefined) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl
      );
      this._imageBlob = event.blob;

      console.log('Imagen recortada y blob almacenado:', this._imageBlob);

      // Solo llama a onChange si _imageBlob es un Blob válido
      if (this._imageBlob instanceof Blob) {
        this.onChange(this._imageBlob);
        this.onTouched();
      } else {
        console.error(
          'No se pudo obtener un Blob válido de la imagen recortada'
        );
      }
    }
  }
  imageLoaded(image: LoadedImage) {
    console.log('Imagen cargada', image);
  }

  cropperReady() {
    console.log('Imagen lista para recortar');
  }

  loadImageFailed() {
    console.log('Error al cargar la imagen');
  }
  async clickRegister(): Promise<void> {
    console.log('Verificando información para actualización');
    if (this.updateForm.valid) {
      const formData = new FormData();

      // Validar y agregar usuario
      const usuario = this.updateForm.get('usuario')?.value;
      if (usuario !== undefined) {
        formData.append('usuario', usuario);
      }

      // Validar y agregar teléfono
      const celular = this.updateForm.get('celular')?.value;
      if (celular !== undefined) {
        formData.append('telefono', celular);
      }

      // Contraseña siempre obligatoria
      const contrasena = this.updateForm.get('contrasena')?.value || '';
      formData.append('contrasena', contrasena);

      // Validar y agregar descripción
      const descripcion = this.updateForm.get('descripcion')?.value;
      if (descripcion !== undefined) {
        formData.append('descripcion', descripcion);
      }

      // Validar y agregar intereses
      if (this.selectedInterests.length > 0) {
        formData.append('intereses', JSON.stringify(this.selectedInterests));
      } else {
        console.warn('No se han seleccionado intereses.');
        formData.append('intereses', '[]'); // Valor por defecto
      }

      // Validar y agregar imagen
      if (this._imageBlob) {
        formData.append('imagen', this._imageBlob, 'profile.jpg');
      }

      // Verificar contenido de FormData
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      try {
        const response = await this.apiService.update(this.getId(), formData);
        console.log('Respuesta del servidor:', response);

        if (response && response.success) {
          console.log('Usuario actualizado con éxito');
          this.router.navigate(['ruta/de/destino']);
        } else {
          console.error('Error en la actualización:', response?.message);
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    } else {
      // Mostrar errores de validación
      Object.keys(this.updateForm.controls).forEach((key) => {
        const controlErrors = this.updateForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Error en ${key}: `, controlErrors);
        }
      });
    }
  }

  getId() {
    const id_persona = localStorage.getItem('id_persona');
    if (id_persona != 'undefined') {
      return id_persona;
    } else {
      console.log('no hay una id en el local storage');
      return;
    }
  }
}

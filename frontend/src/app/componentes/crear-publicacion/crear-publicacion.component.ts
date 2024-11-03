import { Component, inject } from '@angular/core';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [
    ImageCropperComponent,
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CrearPublicacionComponent,
      multi: true,
    },
  ],
})
export class CrearPublicacionComponent {
  router: Router = inject(Router);
  apiService: ApiRestService = inject(ApiRestService);
  form: FormGroup;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  private _imageBlob: Blob | null | undefined = undefined;
  onChange = (image: Blob) => {};
  onTouched = () => {};
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      etiquetas: [''],
      imagen: [null, Validators.required],
    });
  }
  ngOnInit() {
    const storedId = localStorage.getItem('id_persona');
    if (!storedId) {
      console.error('ID de persona no encontrado en localStorage');
    } else {
      console.log('ID de persona obtenido:', storedId);
    }
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
    console.log('Error al cargar la imagen');
  }

  async save() {
    const storedId = localStorage.getItem('id_persona');
    try {
      if (!this._imageBlob || !storedId) {
        console.error('Imagen o ID no presentes');
        return;
      }

      const formData = new FormData();
      formData.append('id_creador', storedId);
      formData.append('titulo', this.form.get('titulo')?.value || '');
      formData.append('descripcion', this.form.get('descripcion')?.value || '');
      formData.append('ubicacion', this.form.get('ubicacion')?.value || '');
      formData.append('etiquetas', this.form.get('etiquetas')?.value || '');
      formData.append('imagenes', this._imageBlob, 'image.webp');

      console.log('Datos de FormData antes de enviar:', formData);

      const response = await this.apiService.postPublicacion(formData);
      console.log('Respuesta del backend:', response);
      this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error al guardar la publicación:', error);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      this.save();
    }
  }
  writeValue(obj: any): void {
    if (obj) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

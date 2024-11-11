import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { ApiRestService } from '../../servicios/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [
    ImageCropperComponent,
    ReactiveFormsModule,
    CommonModule,
    IonChip,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonCardTitle,
    IonButton,
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
  // Lógica de etiquetas
  availableTagsList: { id_etiqueta: number; etiqueta: string }[] = [];
  selectedTags: string[] = [];
  showTagsList = false;

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
    this.loadTags();
  }

  async loadTags() {
    const etiquetas = await this.apiService.get('etiquetas');
    this.availableTagsList = etiquetas;
  }

  get availableTags(): string[] {
    return this.availableTagsList
      .filter((tag) => !this.selectedTags.includes(tag.etiqueta))
      .map((tag) => tag.etiqueta);
  }

  toggleTagsList() {
    this.showTagsList = !this.showTagsList;
  }

  selectTag(tagName: string) {
    this.selectedTags.push(tagName);
    this.updateTagsControl();
    this.showTagsList = false;
  }

  removeTag(tagName: string) {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagName);
    this.updateTagsControl();
  }

  private updateTagsControl() {
    this.form.get('etiquetas')?.setValue(JSON.stringify(this.selectedTags));
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
      formData.append('imagenes', this._imageBlob, `${storedId}.jpg`);

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
  salir() {
    this.router.navigate(['/inicio']);
  }
}

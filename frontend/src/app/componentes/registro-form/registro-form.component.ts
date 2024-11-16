import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonInput,
  IonNote,
  IonRow,
} from '@ionic/angular/standalone';
import {
  PasswordStateMatcher,
  crossPasswordMatchingValidatior,
  customPasswordValidator,
} from './register-costum-validators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { IonCard } from '@ionic/angular/standalone';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';

@Component({
  selector: 'app-registro-form',
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
    ImageCropperComponent,
  ],
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RegistroFormComponent,
      multi: true,
    },
  ],
})
export class RegistroFormComponent implements OnInit {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  private _imageBlob: Blob | null | undefined = undefined;
  onChange = (image: Blob) => {};
  onTouched = () => {};
  constructor(private sanitizer: DomSanitizer) {}
  //declaracion del fromGrup
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  passwordStateMatcher = new PasswordStateMatcher();
  formGroup = this._formBuilder.group(
    {
      usuario: ['', Validators.required],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      celular: [
        '',
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [customPasswordValidator, Validators.required]],
      confirmContrasena: ['', Validators.required],
      descripcion: [
        '',
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(9),
      ],
      intereses: ['', Validators.required],
    },
    {
      validators: crossPasswordMatchingValidatior,
    }
  );

  private apiService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  //logica de intereses
  availableInterestsList: string[] = [];
  selectedInterests: string[] = [];
  showInterestsList = false;

  ngOnInit() {
    this.loadInterests();
    this.cargarUrlDatos();
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
    this.formGroup
      .get('intereses')
      ?.setValue(JSON.stringify(this.selectedInterests));
  }

  async clickRegister(): Promise<void> {
    console.log('Verificando información');
    if (this.formGroup.valid) {
      const formData = new FormData();

      // Agregar los valores del formulario
      formData.append('usuario', this.formGroup.get('usuario')?.value || '');
      formData.append('nombre', this.formGroup.get('nombre')?.value || '');
      formData.append('apellido', this.formGroup.get('apellido')?.value || '');
      formData.append('telefono', this.formGroup.get('celular')?.value || '');
      formData.append('email', this.formGroup.get('email')?.value || '');
      formData.append(
        'contrasena',
        this.formGroup.get('contrasena')?.value || ''
      );
      formData.append(
        'descripcion',
        this.formGroup.get('descripcion')?.value || ''
      );

      // Agregar intereses seleccionados como JSON
      if (this.selectedInterests.length > 0) {
        formData.append('intereses', JSON.stringify(this.selectedInterests));
      } else {
        console.error('No se han seleccionado intereses.');
      }
      if (!this._imageBlob) {
        console.error('Imagen o ID no presentes');
        return;
      }
      formData.append('imagen', this._imageBlob);

      try {
        const response = await this.apiService.register('', formData);
        console.log(response);

        if (response && response.token) {
          this.apiService.setToken(response.token);
          this.router.navigate(['auth/login']);
        } else {
          console.error(
            'Error en el registro: Token no encontrado en la respuesta'
          );
        }
      } catch (error) {
        console.error('Error en el registro:', error);
      }
    } else {
      // Mostrar los errores de validación en consola
      Object.keys(this.formGroup.controls).forEach((key) => {
        const controlErrors = this.formGroup.get(key)?.errors;
        if (controlErrors) {
          console.log(`Error en ${key}: `, controlErrors);
        }
      });
    }
  }

  get Usuario(): FormControl<string> {
    return this.formGroup.controls.usuario;
  }
  get Nombre(): FormControl<string> {
    return this.formGroup.controls.nombre;
  }
  get Apellido(): FormControl<string> {
    return this.formGroup.controls.apellido;
  }
  get Celular(): FormControl<string> {
    return this.formGroup.controls.celular;
  }
  get Email(): FormControl<string> {
    return this.formGroup.controls.email;
  }
  get Contrasena(): FormControl<string> {
    return this.formGroup.controls.contrasena;
  }
  get ConfirmContrasena(): FormControl<string> {
    return this.formGroup.controls.confirmContrasena;
  }
  get Intereses(): FormControl<string> {
    return this.formGroup.controls.intereses;
  }
  get Descripcion(): FormControl<string> {
    return this.formGroup.controls.descripcion;
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
  getUserDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const nombre = urlParams.get('given_name');
    const apellido = urlParams.get('family_name');
    if (!email || !nombre || !apellido) {
      console.error('No se han encontrado los datos esperados en la URL');
      return null;
    }
    return { email, nombre: nombre, apellido };
  }
  cargarUrlDatos() {
    const userData = this.getUserDataFromURL();
    if (userData) {
      console.log(userData);

      if (userData.apellido === 'undefined') {
        this.formGroup.patchValue({
          nombre: userData.nombre,
          email: userData.email,
        });
        console.log('No tienes un apellido ligado a tu cuenta');
      }
      if (userData.apellido != 'undefined') {
        this.formGroup.patchValue({
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
        });
      }
    }
  }
}

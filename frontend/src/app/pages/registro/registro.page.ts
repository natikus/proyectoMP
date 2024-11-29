import { Component } from '@angular/core';
import { RegistroFormComponent } from '../../componentes/registro-form/registro-form.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonContent, RegistroFormComponent],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.css'],
})
export class RegistroPage {}

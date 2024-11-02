import { Component } from '@angular/core';
import { RegistroFormComponent } from '../../componentes/registro-form/registro-form.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RegistroFormComponent],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.css'],
})
export class RegistroPage {}

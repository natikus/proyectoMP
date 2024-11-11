import { Component, OnInit } from '@angular/core';
import { AjustesFormComponent } from '../../componentes/ajustes-form/ajustes-form.component';
@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [AjustesFormComponent],
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.css'],
})
export class AjustesPage {}

import { Component, OnInit } from '@angular/core';
import { AjustesFormComponent } from '../../componentes/ajustes-form/ajustes-form.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [IonContent, AjustesFormComponent],
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.css'],
})
export class AjustesPage {}

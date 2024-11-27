import { Component, OnInit } from '@angular/core';

import { ComunidadFormmComponent } from '../../componentes/comunidad-formm/comunidad-formm.component';
import { IonGrid, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-comunidad-form',
  standalone: true,
  imports: [IonContent, IonGrid, ComunidadFormmComponent],
  templateUrl: './comunidad-form.page.html',
  styleUrls: ['./comunidad-form.page.scss'],
})
export class ComunidadFormPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

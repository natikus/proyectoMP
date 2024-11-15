import { Component, OnInit } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    IonItem,
    IonText,
    IonItemDivider,
    IonLabel,
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
  ],
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage {}

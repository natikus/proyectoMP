import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  MenuController,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [
    IonRouterOutlet,
    RouterLink,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonMenuButton,
    IonButtons,
    IonTitle,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
  ],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
})
export class MenuLateralComponent {
  apiService: AuthService = inject(AuthService);
  private menuController = inject(MenuController);

  toggleMenu() {
    this.menuController.toggle();
  }

  closeMenu() {
    this.menuController.close();
  }

  isValidUser() {
    return this.apiService.isValidUser();
  }

  logOut() {
    this.apiService.logOut();
  }
}

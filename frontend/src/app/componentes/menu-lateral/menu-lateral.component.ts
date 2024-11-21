import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [
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
    RouterLink,
  ],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
})
export class MenuLateralComponent {
  apiService: AuthService = inject(AuthService);
  private menuController = inject(MenuController);
  router: Router = inject(Router);

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
  miPerfil() {
    console.log('Cerrando el menu');
    this.menuController.close();
    const id_persona = localStorage.getItem('id_persona');
    console.log('id_persona', id_persona);
    if (id_persona) {
      console.log('no es null');
      localStorage.setItem('id_usuario', id_persona);
      console.log(localStorage);
      this.router.navigate(['/inicio/porfile/', id_persona]);
    }
  }
  editarme() {
    this.menuController.close();
    const id_persona = localStorage.getItem('id_persona');
    console.log(localStorage);
    this.router.navigate([`/inicio/porfile/${id_persona}/settings`]);
  }
  ayudaaaa() {
    this.menuController.close();
    console.log('ayudando');
    this.router.navigate([`/help`]);
  }
}

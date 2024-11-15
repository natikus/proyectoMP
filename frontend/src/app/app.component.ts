import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLateralComponent } from './componentes/menu-lateral/menu-lateral.component';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuLateralComponent, IonRouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Mutual Purpose';
  apiService: AuthService = inject(AuthService);
  isCollapsed = false;
}

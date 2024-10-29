import { Routes } from '@angular/router';
import { AuthPage } from './pages/login/auth/auth.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { logueadoGuard } from './guards/logueado.guard';
export const routes: Routes = [
  {
    path: 'auth/login',
    component: AuthPage,
  },
  {
    path: 'inicio',
    component: InicioPage,
    canActivate: [logueadoGuard],
  },
];

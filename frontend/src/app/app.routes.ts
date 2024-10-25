import { Routes } from '@angular/router';
import { AuthPage } from './pages/login/auth/auth.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { logueadoGuard } from './guards/logueado.guard';
import { VerPublicacionPage } from './pages/ver-publicacion/ver-publicacion.page';
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
  {
    path: 'inicio/:id',
    component: VerPublicacionPage,
    canActivate: [logueadoGuard],
  },
];

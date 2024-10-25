import { Routes } from '@angular/router';
import { AuthPage } from './pages/login/auth/auth.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { logueadoGuard } from './guards/logueado.guard';
import { VerPublicacionPage } from './pages/ver-publicacion/ver-publicacion.page';
import { CrearPage } from './pages/crear/crear.page';
import { RegistroPage } from './pages/registro/registro.page.';
export const routes: Routes = [
  {
    path: 'auth',
    component: RegistroPage,
  },
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
    path: 'inicio/crear',
    component: CrearPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'inicio/:id',
    component: VerPublicacionPage,
    canActivate: [logueadoGuard],
  },
];

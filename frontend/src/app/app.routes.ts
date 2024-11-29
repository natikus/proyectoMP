import { Routes } from '@angular/router';
import { AuthPage } from './pages/login/auth/auth.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { logueadoGuard } from './guards/logueado.guard';
import { PerfilPage } from './pages/perfil/perfil.page';
import { CrearPage } from './pages/crear/crear.page';
import { RegistroPage } from './pages/registro/registro.page';
import { VerPublicacionPage } from './pages/publicacion/publicacion.page';
import { AjustesPage } from './pages/ajustes/ajustes.page';
import { BuscarPage } from './pages/buscar/buscar.page';
import { AyudaPage } from './pages/ayuda/ayuda.page';
export const routes: Routes = [
  {
    path: 'help',
    component: AyudaPage,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'inicio/porfile/:id',
    component: PerfilPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'auth/login',
    component: AuthPage,
  },
  {
    path: 'auth/registro',
    component: RegistroPage,
  },
  {
    path: 'inicio',
    component: InicioPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'inicio/create',
    component: CrearPage,
    canActivate: [logueadoGuard],
  },

  {
    path: 'inicio/search',
    component: BuscarPage,
    canActivate: [logueadoGuard],
  },

  {
    path: 'inicio/:id_publicacion',
    component: VerPublicacionPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'inicio/porfile/:id/settings',
    component: AjustesPage,
    canActivate: [logueadoGuard],
  },
];

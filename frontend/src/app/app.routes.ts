import { Routes } from '@angular/router';
import { AuthPage } from './pages/login/auth/auth.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { logueadoGuard } from './guards/logueado.guard';
import { PerfilPage } from './pages/perfil/perfil.page';
import { CrearPage } from './pages/crear/crear.page';
import { RegistroPage } from './pages/registro/registro.page';
import { VerPublicacionPage } from './pages/ver-publicacion/ver-publicacion.page';
export const routes: Routes = [
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
    path: 'inicio/porfile/:id',
    component: PerfilPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'inicio/create',
    component: CrearPage,
    canActivate: [logueadoGuard],
  },
  {
    path: 'inicio/:id_publicacion',
    component: VerPublicacionPage,
    canActivate: [logueadoGuard],
  },
];

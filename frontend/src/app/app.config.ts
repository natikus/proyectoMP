import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    NbThemeModule.forRoot({ name: 'default' }).providers || [], // Asegúrate de que no sea undefined
    NbLayoutModule,
  ],
};

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  getUsuarioPorEmail(username: string): Observable<any | null> {
    return from(
      fetch(`https://localhost/backend/auth`, { method: 'GET' })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
          }
          return response.json();
        })
        .then(
          (usuarios) =>
            usuarios.find(
              (user: { email: string }) => user.email === username
            ) || null
        )
        .catch((error) => {
          console.error('Error en la obtención de usuarios:', error);
          return null;
        })
    );
  }
}

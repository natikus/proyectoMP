import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { usuarios } from '../interface/persona';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  localhost?: string = '10.4.201.163';
  readonly API_URL = `https://${this.localhost}/backend/auth/`;
  private router: Router = inject(Router);
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  isValidUser(): boolean {
    return !!localStorage.getItem('token');
  }
  async post(url: string, body: string) {
    const response = await fetch(`${this.API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }
  async getIntereses() {
    try {
      const response = await fetch(`${this.API_URL}intereses`);
      if (!response.ok) throw new Error('Error al obtener intereses');

      const data: { intereses: string[] }[] = await response.json(); // Tipo más preciso

      const interesesAplanados = data
        .flatMap((item) => item.intereses)
        .flatMap((arr) => arr);

      return interesesAplanados;
    } catch (error) {
      console.error('Error al obtener intereses:', error);
      return [];
    }
  }

  async postIntereses(interes: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}intereses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Asegúrate de especificar el tipo de contenido
        },
        body: JSON.stringify({ interes }), // Envía el interés como un objeto JSON
      });

      if (!response.ok) throw new Error('Error al crear el interés');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async register(url: string, formData: FormData) {
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al crear la persona');

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async update(id_persona: string | null | undefined, formData: FormData) {
    console.log('SOY EL TOKEN Y ESOY EDITANDO', localStorage.getItem('token'));
    try {
      const response = await fetch(
        `https://${this.localhost}/backend/usuario/${id_persona}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // NO agregues 'Content-Type' aquí porque el navegador lo define automáticamente para 'FormData'
          },
          body: formData, // Asegúrate de pasar el objeto FormData correctamente
        }
      );
      if (!response.ok) throw new Error('Error al editar la persona');

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
  loginGoogle(user: string, token: string) {
    try {
      if (user && token) {
        localStorage.setItem('token', token);

        localStorage.setItem('id_persona', user);
        this.setToken(token);
        this.router.navigate(['/inicio']);
      } else {
        console.error('Login con google no disponible');
        //no se pq funciona pero tira esto, lo importante es que fundiona :)
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  readonly API_URL = 'https://localhost/backend/auth/';
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
  logOut() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
}

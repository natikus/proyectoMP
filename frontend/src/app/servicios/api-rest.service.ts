import { Injectable } from '@angular/core';
import { publicaciones } from '../interface/publicacion';

@Injectable({
  providedIn: 'root',
})
export class ApiRestService {
  constructor() {}

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  readonly API_URL = 'http://localhost/backend/';

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    } else {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async post(url: string, body: string) {
    const response = await fetch(`${this.API_URL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body,
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }
  async get(url: string) {
    const fullUrl = `${this.API_URL}${url}`;
    console.log('URL completa:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    console.log('Respuesta de la API:', response);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error('Error en la respuesta:', data);
      throw new Error(data);
    }
  }

  async postPublicacion(formData: FormData) {
    try {
      const response = await fetch(`${this.API_URL}publicaciones`, {
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
}

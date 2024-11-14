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

  readonly API_URL = 'https://localhost/backend/';

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  }

  async post(url: string, body: object) {
    try {
      const response = await fetch(`${this.API_URL}${url}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error('Error en POST:', data);
        throw new Error(data.message || 'Error en la solicitud POST');
      }
    } catch (error) {
      console.error('Error de red en POST:', error);
      throw error;
    }
  }

  async get(url: string) {
    try {
      console.log('estoy en la pai+++++++++++++');
      const response = await fetch(`${this.API_URL}${url}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('respondi bien**SFGDZ*C********');
        console.log('SOY LA DSTA', data);
        return data;
      } else {
        console.error('Error en GET:', data);
        throw new Error(data.message || 'Error en la solicitud GET');
      }
    } catch (error) {
      console.error('Error de red en GET:', error);
      throw error;
    }
  }

  async postPublicacion(formData: FormData) {
    try {
      const response = await fetch(`${this.API_URL}publicaciones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en postPublicacion:', errorData);
        throw new Error(errorData.message || 'Error al crear la publicación');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en postPublicacion:', error);
      throw error;
    }
  }
}

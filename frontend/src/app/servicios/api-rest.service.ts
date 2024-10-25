import { Injectable } from '@angular/core';
import { publicaciones } from '../interface/publicacion';
@Injectable({
  providedIn: 'root',
})
export class ApiRestService {
  constructor() {}
  private token?: string = undefined;

  setToken(token: string) {
    this.token = token;
  }

  readonly API_URL = 'http://localhost/backend/';

  private getHeaders(): HeadersInit {
    if (this.token) {
      return {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      };
    } else {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  isValidUser(): boolean {
    return !!this.token;
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
    const response = await fetch(`${this.API_URL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  async postPublicacion(endpoint: string, data: publicaciones): Promise<any> {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en la creación de la publicación');
    }

    return await response.json();
  }
}

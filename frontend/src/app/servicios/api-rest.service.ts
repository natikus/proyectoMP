import { Injectable } from '@angular/core';

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
}

import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cochera';

@Injectable({
  providedIn: 'root',
})
export class CocherasService {
  private baseUrl = 'http://localhost:4000';
  auth = inject(AuthService);

  cocheras() {
    return fetch(`${this.baseUrl}/cocheras`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((r) => r.json());
  }

  crearCochera() {
    return fetch(`${this.baseUrl}/cocheras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
      body: JSON.stringify({
        descripcion: 'Nueva cochera',
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error al crear la cochera');
      }
      return response.json();
    });
  }

  habilitarCochera(idCochera: number) {
    return fetch(`${this.baseUrl}/cocheras/${idCochera}/enable`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error al habilitar la cochera');
      }
      return response.json();
    });
  }

  eliminarCochera(idCochera: number) {
    return fetch(`${this.baseUrl}/cocheras/${idCochera}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error al eliminar la cochera');
      }
      return response.json();
    });
  }

  deshabilitarCochera(idCochera: number) {
    return fetch(`${this.baseUrl}/cocheras/${idCochera}/disable`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error al deshabilitar la cochera');
      }
      return response.json();
    });
  }
}

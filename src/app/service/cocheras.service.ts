import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cochera';

@Injectable({
  providedIn: 'root'
})
export class CocherasService {
  deshabilitar(cochera: Cochera & { activo: import("../interfaces/estacionamiento").Estacionamiento | null; }) {
    throw new Error('Method not implemented.');
  }
  cargar() {
    throw new Error('Method not implemented.');
  }
  eliminar(cochera: Cochera & { activo: import("../interfaces/estacionamiento").Estacionamiento | null; }) {
    throw new Error('Method not implemented.');
  }
  habilitar(cochera: Cochera & { activo: import("../interfaces/estacionamiento").Estacionamiento | null; }) {
    throw new Error('Method not implemented.');
  }
  agregar() {
    throw new Error('Method not implemented.');
  }
  cambiarDisponibilidadCochera(cochera: Cochera, opcion: string) {
    throw new Error('Method not implemented.');
  }
  auth = inject(AuthService);

  cocheras() { 
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },

    }).then(r=>r.json());
  }
}

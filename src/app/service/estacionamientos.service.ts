import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EstacionamientosService {
  auth = inject(AuthService);

  estacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((r) => r.json());
  }

  buscarEstacionamientoActivo(cocheraId: number) {
    return this.estacionamientos().then((estacionamientos) => {
      let buscado = null;
      for (let estacionamiento of estacionamientos) {
        if (
          estacionamiento.idCochera === cocheraId &&
          estacionamiento.horaEgreso === null
        ) {
          buscado = estacionamiento;
        }
      }
      return buscado;
    });
  }
  estacionarAuto(patenteAuto: string, idCochera: number) {
    return fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idCochera: idCochera,
        idUsuarioIngreso: 'admin',
      }),
    }).then((r) => r.json());
  }
  liberarCochera(idCochera: number) {
    return fetch('http://localhost:4000/estacionamientos/cerrar', {
      method: 'PATCH',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),

        body: JSON.stringify({ idCochera }),
      },
    }).then((response) => {
      if (response.ok) {
        Swal.fire(
          'Cochera liberada',
          'La cochera se libero con exito',
          'success'
        );
      } else {
        Swal.fire(
          'Error',
          'No se pudo liberar la cochera. Intente nuevamente',
          'error'
        );
      }
    });
  }
  cobrarEstacionamiento(idCochera: number, patente: string, costo: number) {
    return fetch('http://localhost:4000/estacionamientos/cerrar/', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patente: patente,
        idCochera: idCochera,
        costo: costo,
      }),
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message);
        });
      }
      return response.json();
    });
  }
}


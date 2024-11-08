import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { CocherasService } from '../../service/cocheras.service';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../service/estacionamientos.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss',
})
export class EstadoCocherasComponent {
  titulo: string = 'Estado de la cochera';
  header: {
    nro: string;
    deshabilitada: string;
    ingreso: string;
    acciones: string;
  } = {
    nro: 'N°',
    deshabilitada: 'DISPONIBILIDAD',
    ingreso: 'INGRESO',
    acciones: 'ACCIONES',
  };
  filas: Cochera[] = [];
  siguienteNumero: number = 1;

  auth = inject(AuthService);
  estacionamientos = inject(EstacionamientosService);
  cocheras = inject(CocherasService);

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    return this.cocheras.cocheras().then((cocheras) => {
      this.filas = [];
      for (let cochera of cocheras) {
        this.estacionamientos
          .buscarEstacionamientoActivo(cochera.id)
          .then((estacionamiento) => {
            this.filas.push({
              ...cochera,
              deshabilitada: !estacionamiento,
              activo: estacionamiento,
              patente: estacionamiento ? estacionamiento.patente : undefined,
              fechaIngreso: estacionamiento
                ? new Date(estacionamiento.horaIngreso).toLocaleDateString()
                : undefined,
              horaIngreso: estacionamiento
                ? new Date(estacionamiento.horaIngreso).toLocaleTimeString()
                : undefined,
            });
          });
      }
    });
  }

  agregarFila() {
    this.cocheras
      .crearCochera()
      .then(() => {
        Swal.fire(
          'Cochera agregada',
          'La cochera ha sido registrada con éxito.',
          'success'
        );
        this.traerCocheras();
      })
      .catch((error) => {
        console.error('Error al crear la cochera:', error);
        Swal.fire('Error', 'Hubo un problema al crear la cochera.', 'error');
      });
  }

  eliminarFila(id: number, event: Event) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer. La cochera será eliminada permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras
          .eliminarCochera(id)
          .then(() => {
            Swal.fire(
              'Eliminada',
              'La cochera ha sido eliminada permanentemente.',
              'success'
            );
            this.traerCocheras();
          })
          .catch((error) => {
            console.error('Error al eliminar la cochera:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la cochera.',
              'error'
            );
          });
      }
    });
  }

  cambiarDisponibilidadCochera(fila: Cochera) {
    const now = new Date();
    if (fila.deshabilitada) {
      Swal.fire({
        title: 'Ingrese la patente del vehículo',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Por favor, ingrese una patente válida';
          }
          return null;
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.estacionamientos
            .estacionarAuto(result.value, fila.id)
            .then(() => {
              fila.patente = result.value;
              fila.deshabilitada = false;
              fila.fechaIngreso = now.toLocaleDateString();
              fila.horaIngreso = now.toLocaleTimeString();
              fila.fechaDeshabilitado = undefined;
              fila.horaDeshabilitado = undefined;
              Swal.fire(
                'Patente registrada',
                'La cochera ahora está ocupada.',
                'success'
              );
            })
            .catch((error) => {
              console.error('Error al ocupar la cochera:', error);
              Swal.fire(
                'Error',
                'Hubo un problema al ocupar la cochera en el sistema.',
                'error'
              );
            });
        }
      });
    } else {
      if (fila.patente) {
        Swal.fire(
          'Advertencia',
          'Debe cobrar el estacionamiento antes de liberar esta cochera',
          'warning'
        );
        return;
      }

      this.estacionamientos
        .liberarCochera(fila.id)
        .then(() => {
          fila.deshabilitada = true;
          fila.patente = undefined;
          fila.fechaDeshabilitado = now.toLocaleDateString();
          fila.horaDeshabilitado = now.toLocaleTimeString();
          Swal.fire(
            'Cochera liberada',
            'La cochera ahora está disponible.',
            'success'
          );
        })
        .catch((error) => {
          console.error('Error al liberar la cochera', error);
          Swal.fire(
            'Error',
            'Hubo un problema al liberar la cochera en el sistema.',
            'error'
          );
        });
    }
  }

  cobrarEstacionamiento(idCochera: number) {
    this.estacionamientos
      .buscarEstacionamientoActivo(idCochera)
      .then((estacionamiento) => {
        if (!estacionamiento) {
          Swal.fire(
            'Error',
            'No se encontró un estacionamiento activo para la cochera',
            'error'
          );
          return;
        }

        const horaIngreso = new Date(estacionamiento.horaIngreso);
        const tiempoTranscurridoMs =
          new Date().getTime() - horaIngreso.getTime();
        const horas = Math.floor(tiempoTranscurridoMs / (1000 * 60 * 60));
        const minutos = Math.floor(
          (tiempoTranscurridoMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const precio = tiempoTranscurridoMs / 1000 / 60 / 60;

        Swal.fire({
          title: 'Cobrar estacionamiento',
          text: `Tiempo transcurrido: ${horas}hs ${minutos}mins - Precio: $${precio.toFixed(
            2
          )}`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#00c98d',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Cobrar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            fetch('http://localhost:4000/estacionamientos/cerrar', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
              },
              body: JSON.stringify({
                patente: estacionamiento.patente,
                idUsuarioEgreso: 'ADMIN',
              }),
            })
              .then((response) => {
                if (!response.ok)
                  throw new Error('Error al cerrar estacionamiento');
                return response.json();
              })
              .then(() => {
                return this.cocheras.habilitarCochera(idCochera);
              })
              .then(() => {
                Swal.fire(
                  'Estacionamiento cobrado',
                  'El estacionamiento ha sido cobrado y la cochera está disponible.',
                  'success'
                );
                this.traerCocheras();
              })
              .catch((error) => {
                console.error('Error:', error);
                Swal.fire(
                  'Error',
                  'Hubo un error al procesar la operación.',
                  'error'
                );
              });
          }
        });
      })
      .catch((error) => {
        console.error('Error al buscar el estacionamiento activo:', error);
        Swal.fire(
          'Error',
          'Hubo un error al buscar el estacionamiento.',
          'error'
        );
      });
  }

  cambiarEstadoManual(fila: Cochera) {
    const now = new Date();

    if (fila.patente) {
      return;
    }

    if (fila.deshabilitada) {
      this.cocheras
        .deshabilitarCochera(fila.id)
        .then(() => {
          const cocheraActualizada = this.filas.find((f) => f.id === fila.id);
          if (cocheraActualizada) {
            cocheraActualizada.deshabilitada = false;
            cocheraActualizada.fechaDeshabilitado = now.toLocaleDateString();
            cocheraActualizada.horaDeshabilitado = now.toLocaleTimeString();
          }
        })
        .catch((error) => {
          console.error('Error al cambiar estado:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al cambiar el estado de la cochera.',
            'error'
          );
        });
    } else {
      this.cocheras
        .habilitarCochera(fila.id)
        .then(() => {
          const cocheraActualizada = this.filas.find((f) => f.id === fila.id);
          if (cocheraActualizada) {
            cocheraActualizada.deshabilitada = true;
            cocheraActualizada.fechaDeshabilitado = undefined;
            cocheraActualizada.horaDeshabilitado = undefined;
          }
        })
        .catch((error) => {
          console.error('Error al cambiar estado:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al cambiar el estado de la cochera.',
            'error'
          );
        });
    }
  }
}

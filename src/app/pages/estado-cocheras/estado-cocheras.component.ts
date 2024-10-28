import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { CocherasService } from '../../service/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../service/estacionamientos.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent {
  titulo: string = 'Estado de la cochera'
  header: { id: string, deshabilitada: string, descripcion: string, acciones: string } = {
    id: 'N°',
    deshabilitada: 'DISPONIBILIDAD',
    descripcion: 'INGRESO',
    acciones: 'ACCIONES',
  };
  filas: (Cochera & {activo: Estacionamiento|null})[] = []
  siguienteNumero: number = 1;
  agregarFila() {
    this.filas.push({
      id: this.siguienteNumero,
      descripcion:'',
      deshabilitada: false,
      eliminada: false,
      activo: null
    });
    this.siguienteNumero += 1;
  }
  eliminarFila(index: number,event:Event) {
    event.stopPropagation()
    this.filas.splice(index, 1);
  }

  cambiarDisponibilidadCochera(numeroFila: number, event:Event) {
    event.stopPropagation();
  if(this.filas[numeroFila].deshabilitada === true){
    this.filas[numeroFila].deshabilitada = false;
  } else {
    this.filas[numeroFila].deshabilitada = true;
  }
    // el fetch que pide cambiar la disponibilidad (son 2)
  }
  getCocheras(){
    fetch("http://localhost:4000/cocheras",{
      headers:{
        authorization:'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…3OTR9.F22bfwhbUd8GnUi__2brLX5ePrbZ3spmWe7Leg6J4Fo'
      },
    });
  }
  ngOnInit(){
    this.traerCocheras().then(filas => {
      this.filas = filas; 
    });
  }

  auth= inject(AuthService);
  cocheras = inject(CocherasService);
  estacionamientos = inject(EstacionamientosService)
  
  traerCocheras(){
    return this.cocheras.cocheras();
  }
  abrirModalNuevoEstacionamiento(idCochera: number){
    console.log("Abriendo modal cochera", idCochera);
  Swal.fire({
      title: "Ingrese la patente del vehículo",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese una patente válida.";
        }
        return
      }
    }).then(res =>{
      if(res.isConfirmed){
        console.log("Tengo que estacionar la patente",res.value);
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          this.traerCocheras()
        }) 
      }  
    });
  }
}
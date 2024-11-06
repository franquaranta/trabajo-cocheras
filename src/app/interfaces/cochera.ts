import { Estacionamiento } from "./estacionamiento";

export interface Cochera {
    id: number,
    deshabilitada: boolean,
    descripcion: string,
    eliminada: boolean,
    activo: Estacionamiento|null,
    patente?: string,
    fechaIngreso?: string;
    horaIngreso?: string;
    fechaDeshabilitado?: string;
    horaDeshabilitado?: string;
  
}
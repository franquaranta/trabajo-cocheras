export interface Estacionamiento {
    estado: string;
    habilitada: any;
    id: number;
    patente: string;
    horaIngreso: string;
    horaEgreso: string;
    costo: number|null;
    idUsuarioIngreso: string;
    idUsuarioEgreso: string|null;
    idCochera: number;
    eliminado: null;
}
import { Libro } from "./libro";
import { Usuario } from "./usuario";

export interface Resena {
    _id: string,
    id_usuario: Usuario,
    id_libro: Libro,
    contenido: string,
    calificacion: number,
    fecha: Date

}

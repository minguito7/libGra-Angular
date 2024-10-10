import { Libro } from "./libro";
import { Poblacion } from "./poblacion";

export interface Usuario {
    _id: string,
    DNI: string,
    NOMBRE: string,
    NAMEAPP:string,
    APELLIDOS: string,
    EMAIL: string,
    PASSWORD:string,
    createdAt: Date,
    FECHANAC: Date,
    DIRECCION: string,
    ID_POBLACION: Poblacion, // Referencia al esquema de poblacion
    COD_POSTAL: string,
    TITULO1: string,
    SEXO: string,
    ROLE: string,
    ACTIVO:boolean,
    NUM_USUARIO: number,
    AVATAR: string,
    AMIGOS: Array<Usuario>,
    LIBROS: Array<Libro> 
}

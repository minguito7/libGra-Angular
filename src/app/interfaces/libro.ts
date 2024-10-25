import { Autor } from "./autor";
import { Categoria } from "./categoria";
import { Genero } from "./genero";
import { Resena } from "./resena";
import { Usuario } from "./usuario";

export interface Libro {
    _id: string,
    titulo: string,
    added_usuario: Usuario,
    id_autor: Autor,
    categorias_libro: Array<Categoria>,
    isbn: string,
    fecha_publicacion: Date,
    createdAt: Date,
    generos_libro: Array<Genero>,
    descripcion: string,
    activo: boolean,
    archivo: string, // Aquí puedes guardar el nombre del archivo o la ruta al archivo si lo almacenas en el servidor
    portada:string,
    resenas_libro: Array<Resena>,
}

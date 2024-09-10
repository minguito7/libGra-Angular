export interface LibroLeido {
    id_usuario: string,
    id_libro: string,
    fecha_lectura: Date,
    pagina_actual: number, // Nuevo campo para la página actual
    completado: boolean 
}

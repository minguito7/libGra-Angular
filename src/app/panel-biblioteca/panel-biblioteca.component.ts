import { Component } from '@angular/core';
import { GenerosService } from '../services/generos.service';
import { Libro } from '../interfaces/libro';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-panel-biblioteca',
  templateUrl: './panel-biblioteca.component.html',
  styleUrl: './panel-biblioteca.component.css'
})
export class PanelBibliotecaComponent {
  baseUrl: string = 'http://localhost:3000/';

  generos: any[] = []; // Aquí se almacenarán los géneros
  libros !: Array<Libro>;
  novedadesLibros!: Array<Libro>;
  librosGeneroIndicado!: Array<Libro>;
  currentIndex: number = 0;
  totalImages: number = 0;
  isExpanded:boolean = false;
  autoplayInterval: any = null;

  constructor(private generoService: GenerosService, private libroSevice: BookService) {}

  ngOnInit(): void {
    //this.fetchBooks();
    this.getNovedadesLibros();

    this.getLibros();
    this.getGeneros();
  }

  ngAfterViewInit(): void {
    this.totalImages = this.novedadesLibros.length; // Una vez que se cargan los libros, contar las imágenes
    //this.startAutoplay(3000); // Iniciar autoplay con un intervalo de 3 segundos
 
  }
  ngOnDestroy(): void {
    //this.stopAutoplay(); // Asegurarse de detener el autoplay cuando se destruye el componente
  }

  getLibros(){
    this.libroSevice.getBooksActivos().subscribe( resp =>{
      this.libros = resp.resultado;
    })
  }

  getNovedadesLibros(){
    this.libroSevice.getNovedadesLibros().subscribe(resp=>{
      resp.resultado.forEach( (libro : any)=>{
       console.log(libro.descripcion .trim().length)
      })
      this.novedadesLibros=resp.resultado;
    })
  }

  // Método para obtener los géneros
  getGeneros() {
    this.generoService.getGeneros().subscribe({
      next: (response) => {
        this.generos = response.resultado; // Guarda los géneros en la variable
        console.log('Generos: '+this.generos); // Para depuración
      },
      error: (error) => {
        console.error('Error al obtener los géneros:', error);
      }
    });
  }

  getLibrosGenero(generoId: string){
    try{
      this.librosGeneroIndicado = [];
      this.generoService.getLibrosGenero(generoId).subscribe( resp =>{
        console.log(resp);
      })
    }catch{

    }
  }

  /*PRUEBA SLIDER */
 // Dividir el array de novedades en grupos de 4
  getSecciones() {
    let secciones = [];
    for (let i = 0; i < this.novedadesLibros.length; i += 4) {
      secciones.push(this.novedadesLibros.slice(i, i + 4));
    }
    return secciones;
  }

  toggleDescription(): void {
    this.isExpanded = !this.isExpanded;
  }
}

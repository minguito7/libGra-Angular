import { Component, ViewChild, ElementRef } from '@angular/core';
import { GenerosService } from '../services/generos.service';
import { Libro } from '../interfaces/libro';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario';
import { catchError } from 'rxjs/operators';
import { of,debounceTime, Subject } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-panel-biblioteca',
  templateUrl: './panel-biblioteca.component.html',
  styleUrl: './panel-biblioteca.component.css'
})
export class PanelBibliotecaComponent {
  @ViewChild('loginModalButton') loginModalButton: ElementRef | undefined; // Referencia al botón invisible

  baseUrl: string = 'http://localhost:3000/';

  generos: any[] = []; // Aquí se almacenarán los géneros
  libros !: Array<Libro>;
  novedadesLibros!: Array<Libro>;
  librosGeneroIndicado: Array<Libro> = [];
  currentIndex: number = 0;
  totalImages: number = 0;
  isExpanded:boolean = false;
  autoplayInterval: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  isLoggedIn: boolean = false;
  isSearching:boolean=false;
  usuario!: Usuario;
  clickGenero: boolean = false;
  searchGenero: string = '';
  
  errorMenssageGenero : string = '';
  filteredLibros: any[] = []; // Libros filtrados por búsqueda
  filteredLibrosGenero: any[] = [];
  searchTerm$ = new Subject<string>(); // El subject para la búsqueda
  searchTermGenero: string = '';

  loginData = { email: '', password: '' }; // Para manejar los datos de login

  constructor(private generoService: GenerosService, private libroSevice: BookService,
    private router: Router, private authService:AuthService
  ) {


        // Usamos debounce para evitar ejecutar la búsqueda con cada letra
        this.searchTerm$.pipe(debounceTime(300)).subscribe((searchTerm) => {
          this.isSearching = searchTerm.length >= 3;
          if (this.isSearching) {
            this.filteredLibros = this.libros.filter((book) =>
              book.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
          } else {
            this.filteredLibros = [];
          }
        });
        
    
  }

  ngOnInit(): void {
    //this.fetchBooks();
    this.checkLoginStatus()
    this.getNovedadesLibros();
    this.getLibros();
    this.getGeneros();
  }

  ngAfterViewInit(): void {
    this.totalImages = this.novedadesLibros.length; // Una vez que se cargan los libros, contar las imágenes
    //this.startAutoplay(3000); // Iniciar autoplay con un intervalo de 3 segundos
    if (this.loginModalButton) {
      console.log('Login button loaded:', this.loginModalButton);
    } else {
      console.error('loginModalButton is not defined');
    }
 
  }
  ngOnDestroy(): void {
    //this.stopAutoplay(); // Asegurarse de detener el autoplay cuando se destruye el componente
  }

  checkLoginStatus() {
    const token = localStorage.getItem('Bearer');
    console.log(token);
    if (token) {
      this.authService.validateToken(token).subscribe({
        next: (response: { usuarioLogged: any; valid: boolean }) => {
          console.log(response.usuarioLogged.AVATAR);
          this.isLoggedIn = response.valid;
          if (this.isLoggedIn) {
            this.usuario = response.usuarioLogged;
          }
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
    } else {
      console.log('No hay token, mostrando pop-up de login');
      // En lugar de redirigir, mostramos el modal
      //this.router.navigate([''])
      this.openLoginModal();
    }
  }

  openLoginModal() {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  onLogin() {
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login exitoso');
        // Guardar token en localStorage y cerrar el modal
        localStorage.setItem('Bearer', response.token);
        this.isLoggedIn = true;
        this.usuario = response.usuario;
        

        this.closeModal();
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }

  closeModal() {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    } else {
      console.error('Modal element not found');
    }
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

  getLibrosGenero(generoId: string) {
    this.generoService.getLibrosGenero(generoId).subscribe({
      next: (resp) => {
        this.searchGenero = resp.nombreGenero;
        this.librosGeneroIndicado = resp.resultado;
        this.clickGenero = true;
        console.log(this.searchGenero + this.librosGeneroIndicado);
      },
      error: (err) => {
        // Guardar mensaje de error y mostrar una alerta
        this.errorMenssageGenero = err.error?.error || 'Error al obtener los libros';
        alert(this.errorMenssageGenero);
      }
    });
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

 // Método para buscar libros de manera general
 onSearch(event: any): void {
  const query = event.target.value.toLowerCase();
  this.isSearching = query.length > 3; // Activa la búsqueda si hay más de 3 letras
  this.filteredLibros = this.libros.filter(book => 
    book.titulo.toLowerCase().includes(query) || 
    book.isbn.toLowerCase().includes(query) || 
    (book.id_autor.nombre + ' ' + book.id_autor.apellidos).toLowerCase().includes(query)
  );
}

// Método para buscar libros dentro de un género específico
onSearchGenero(event: any): void {
  const query = event.target.value.toLowerCase();
  this.filteredLibrosGenero = this.librosGeneroIndicado.filter(book => 
    book.titulo.toLowerCase().includes(query) || 
    book.isbn.toLowerCase().includes(query) || 
    (book.id_autor.nombre + ' ' + book.id_autor.apellidos).toLowerCase().includes(query)
  );
}
  
  irLeerLibro(bookId: any){
    console.log("Yendo a leer el libro: "+ bookId);
    //const file: string =this.baseUrl+book;
    if (bookId) {

      this.router.navigate(['/book-reader', bookId]);

    }
  }
}

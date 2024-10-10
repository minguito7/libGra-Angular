import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../services/book.service';
import { PdfStorageService } from '../services/pdf.service';

import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LibroLeidoService } from '../services/libro-leido.service';
import 'swiper/swiper-bundle.css';
//import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { LibroLeido } from '../interfaces/libro-leido';
import { Usuario } from '../interfaces/usuario';
//import { loadPdfWorker } from '../shared/ng2-pdf-viewer-overridden'; // Cambia la ruta según tu estructura


@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.css'
})
export class BookReaderComponent implements OnInit{
  pdfDoc: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 3; // Número de elementos por página
  totalItems:number = 0;

  bookmarket:LibroLeido[] = [];
  public loading: boolean = false;
  baseUrl: string = 'http://localhost:3000/';
 
  //USUARIO LOGUEADO
  isLoggedIn: boolean = false;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;
  fotoServ: string | undefined;
  usuario!:Usuario;
  //Libro
  productId: any = '';
  libro:any;
  libroArchivo!:string;

  safePdfUrl!:SafeResourceUrl;
  ultBookmark:any;
  showBookmarket: boolean = false;
  showModal = false;  // Para mostrar u ocultar el modal
  userPageInput!: number;  // Donde guardaremos la página ingresada por el usuario

//PRUEBA PDF.js


  constructor(private bookService: BookService, private pdfService: PdfStorageService
    , private authService: AuthService, private router: Router,
    private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private librosLeidos:LibroLeidoService
  ){
    this.productId = this.route.snapshot.paramMap.get('bookId');

    this.bookService.getOneBook(this.productId).subscribe((resp: any) =>{
      this.libro = resp;
    });
    this.bookService.getArchivoBook(this.productId).subscribe((resp: any) =>{
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl+resp.resultado);
    });
    const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement;

  }

  
  
  async ngOnInit(){
    
    
    this.checkLoginStatus();

    const token = localStorage.getItem('Bearer');
    console.log("TOKEN DEL ALMACENAMIENTO LOCAL: "+ token);
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.decodedToken;
      this.authService.validateToken(token).subscribe((resp: { usuarioLogged: Usuario; }) => {
        this.fotoServ = this.baseUrl+resp.usuarioLogged.AVATAR;
        this.determinarRol(resp.usuarioLogged);
        this.authService.setUsuario(resp.usuarioLogged);
        this.usuario=resp.usuarioLogged;
        
        console.log(this.esAdmin + ' ' + this.esSoid + ' ' + this.esEditor + ' '+ this.esLector);
        //const objectURL = URL.createObjectURL(this.fotoServ);
        //this.photoUrl = this.sanitizer.bypanombressSecurityTrustUrl(objectURL);
     
      })
    }
    this.loadBookmarket();
   
    
     
  }
  // Método que se ejecuta después de que la vista está completamente inicializada
  ngAfterViewInit(): void {
    const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement;

    // Verificamos si el iframe está listo para ser manipulado
    iframe.onload = () => {
      try {
        // Accedemos al documento dentro del iframe
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

        // Inyectamos un script para detectar clics dentro del iframe
        const script = iframeDocument!.createElement('script');
        script.innerHTML = `
          document.addEventListener('click', function(event) {
            // Comprobamos si el elemento clicado es el botón de descarga
            if (event.target.tagName === 'A' && event.target.getAttribute('href').includes('.pdf')) {
              window.parent.postMessage('descarga-pdf', '*');
            }
          });
        `;
        iframeDocument!.body.appendChild(script);
      } catch (error) {
        console.error('No se pudo acceder al contenido del iframe:', error);
      }
    };

    // Escuchamos mensajes desde el iframe
    window.addEventListener('message', (event) => {
      if (event.data === 'descarga-pdf') {
        alert('El botón de descarga fue clicado en el iframe'); // Mostrar alerta
      }
    });
  }

/* */


/* */


  // Función para abrir el modal
  openBookmarkModal(): void {
    console.log(this.libro)
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeBookmarkModal(): void {
    this.showModal = false;
  }
  // Función para confirmar el marcapáginas
  confirmBookmark(): void {
    if (this.userPageInput && this.userPageInput > 0) {
      this.addBookmark(this.userPageInput);
      this.closeBookmarkModal(); // Cerrar modal al confirmar
    } else {
      alert('Por favor, ingresa un número de página válido.');
    }
  }
  addBookmark(pageNumber: number): void {
    const bookmarkData = {
      id_usuario: this.authService.getUsuario()._id,
      id_libro: this.libro._id,
      pagina_actual: pageNumber, // Usamos la página ingresada por el usuario
    };

    const idUsuario = this.authService.getUsuario()._id;  // Reemplaza con el ID del usuario
    const idLibro = this.libro._id;      // Reemplaza con el ID del libro
    this.loading = true;
  
    this.librosLeidos.getComprobacionBookMarketPagina(idUsuario, idLibro, pageNumber).subscribe(
      (resp: any) => {
        console.log(resp.resultado);
        
        // Si no hay resultado (nunca se ha guardado un marcador antes), o si es válido
        if (resp.resultado === null || resp.resultado === undefined || resp.resultado) {
          
          // Llamada a la API para guardar el marcapáginas
          this.librosLeidos.postBookMarket(bookmarkData).subscribe(
            (response: any) => {
              console.log('Marcador guardado', response);
            },
            (error: any) => {
              console.error('Error al guardar el marcador', error);
            }
          );
        } else {
          // Mostrar mensaje de error si hay un marcador anterior y la página es inferior
          this.showError('No puedes añadir un marcador en una página inferior a la última guardada.');
        }
        this.loading = false;
      },
      (error: any) => {
        console.error('Error en la comprobación de página', error);
        this.loading = false;
      }
    );
  }
  
  // Función para mostrar el mensaje de error
  showError(message: string): void {
    alert(message);  // O usar un modal o componente visual según prefieras.
  }
  
  
getCurrentPageFromIframe(url: string): number {
  const pageMatch = url.match(/#page=(\d+)/);
  return pageMatch ? parseInt(pageMatch[1], 10) : 1;
}

//
  checkLoginStatus() {
    const token = localStorage.getItem('Bearer');
    console.log(token);
    if (token) {
      // Aquí podrías llamar a tu servicio para verificar el token
      this.authService.validateToken(token).subscribe({
        next: (response: {
          usuarioLogged: any; valid: boolean; 
          }) => {
          console.log(response.usuarioLogged.AVATAR);
          this.isLoggedIn = response.valid;
          if (this.isLoggedIn) {
            // Obtener la imagen de perfil del usuario (esto puede variar según tu implementación)
            this.userProfileImage = response.usuarioLogged.AVATAR; // Cambia esto por la URL de la imagen del perfil
          }
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
    }
  }
  logout() {
    console.log("Logout button clicked!");
    this.isLoggedIn = false;
    // Redireccionar a la página de login
    this.authService.logout();
    this.router.navigate(['/']);
    
  }

  isLogged() {
    return this.authService.isLoggedIn;
  }
  
  isAdmin(user: { ROLE: string | string[]; }){
    return user.ROLE.includes('admin');
  }

  isEditor(user: { ROLE: string | string[]; }){
    return user.ROLE.includes('editor');
  }

  isSoid(user: { ROLE: string | string[]; }){
    return user.ROLE.includes('soid');
  }
  isLector(user: { ROLE: string | string[]; }){
    return user.ROLE.includes('lector');
  }
  determinarRol(user: { ROLE: string | string[]; }){
    if (this.isSoid(user)) {
      console.log("holaa aquii SOID: " + user)

      this.esSoid =true;
    } if (this.isAdmin(user)) {
      console.log("holaa aquii ADMIN: " + user)

      this.esSoid =true;
    }if (this.isEditor(user)) {
      console.log("holaa aquii Editor: " + user)

      this.esEditor =true;
    }
    if (this.isLector(user)) {
      console.log("holaa aquii Lector: " + user)

      this.esLector =true;
    }
  }
  irAAdministrarPerfil(): void {
    this.router.navigate(['/perfil-user']);
  }

  loadBookmarket(): void {
    const idUsuario = this.authService.getUsuario()._id;  // Reemplaza con el ID del usuario
    const idLibro = this.libro._id;      // Reemplaza con el ID del libro
    console.log('id librooo: ' + idLibro);
    this.loading = true;


    this.librosLeidos.getBookMarkets(idUsuario, idLibro).subscribe(
      (response: any) => {
        this.bookmarket = response.resultado;
        this.totalItems = this.bookmarket.length;
        this.loading = false; // Desactiva el indicador de carga
        console.log(response.resultado);
      },
      (error: any) => {
        console.error('Error al cargar los datos del bookmarket:', error);
        this.loading = false; // Desactiva el indicador de carga si hay un error
      }
    );
  }
  toggleBookmarket() {
    this.showBookmarket = !this.showBookmarket; // Cambia el estado de visibilidad
    if (this.showBookmarket) {
      this.loadBookmarket(); // Carga los datos solo si el historial se va a mostrar
    }
  }
//pdf2
 // Métodos para cambiar de página
 goToPage(page: number): void {
  if (page > 0 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
    this.currentPage = page;
  }
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

goToNextPage(): void {
  if (this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)) {
    this.currentPage++;
  }

}
get totalPages(): number {
  return Math.ceil(this.totalItems / this.itemsPerPage);
}
  
setSelectedBook(): void {
  this.safePdfUrl
}
nextPage() {
  this.currentPage++;;
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Ajustar zoom
zoomIn() {
  this.currentPage += 0.1;
}



onPdfLoaded(event:any) {
  console.log("PDF cargado correctamente:", event);
}

}
function base64UrlDecode(str: string): string {
  // Reemplazar caracteres específicos de URL
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  // Decodificar base64
  const decodedStr = atob(str);

  // Decodificar URI
  return decodeURIComponent(
    decodedStr
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  
  
}

function jwt_decode(token: string): any {
  try {
    // Dividir el token en sus tres partes
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('El token JWT no tiene el formato adecuado');
    }

    // Decodificar la parte del payloadthis.fotoServ
    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);

    // Parsear el payload a un objeto JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}
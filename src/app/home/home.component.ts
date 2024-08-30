// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { PoblacionService } from '../services/poblacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CategoriasService } from '../services/categorias.service';
import { AutoresService } from '../services/autores.service';
import { GenerosService } from '../services/generos.service';

import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  selectedPortada: File | undefined;
  selectedArchivo: File | undefined;
  books: any[] = [];
  booksNovedad: any[] = [];
  baseUrl: string = 'http://localhost:3000/';
  poblacionForm: FormGroup;
  bookForm:FormGroup;
  errorMessage: string | undefined;
  isLoggedIn: boolean = false;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;
  fotoServ: string | undefined;
  showDropdown = false;
  selectedFile: any;
  categorias: Array<{_id: any; id: number, NOMBRE: string}> = [];
  generos: Array<{_id: any; id: number, NOMBRE: string }> = [];
  autores: Array<{_id: any; id: number, NOMBRE: string, apellidos: string, fecha_nacimiento: Date, nacionalidad: string, generos_autor: ArrayBuffer }> = [];

   // Controla la visibilidad del desplegable
  // Datos del nuevo libro


  getImageUrl(imageName: string): string {
    return `${this.baseUrl}${imageName}`;
  }
  
  constructor(private sanitizer: DomSanitizer,private router: Router,private fb: FormBuilder,
    private bookService: BookService,private authService: AuthService, 
    private poblacionService:PoblacionService, private categoriaService: CategoriasService,
    private autoresSevice:AutoresService, private generoService: GenerosService) { 
    this.poblacionForm = this.fb.group({
      nombre: ['', [Validators.required]],

    });
    this.bookForm = this.fb.group({ 
      titulo:'',
      id_autor: '',
      categorias_libro: [],
      isbn: '',
      fecha_publicacion: '',
      generos_libro: [],
      descripcion: '',
      archivo: '', // Aquí puedes guardar el nombre del archivo o la ruta al archivo si lo almacenas en el servidor
      portada:'',
      resenas_libro: [],
  
     });
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  ngOnInit() {

    this.bookService.getBooksActivos().subscribe(response => {     
         
      this.books = response.resultado;
    });

    this.bookService.getNovedadesLibros().subscribe(response => {     
      console.log(response);
      this.booksNovedad = response.resultado;
    });

    this.checkLoginStatus();
    console.log(this.isLoggedIn);


    const token = localStorage.getItem('Bearer');
    console.log("TOKEN DEL ALMACENAMIENTO LOCAL: "+ token);
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.decodedToken;
      this.authService.validateToken(token).subscribe(resp => {
        this.fotoServ = this.baseUrl+resp.usuarioLogged.AVATAR;
        this.determinarRol(resp.usuarioLogged);
        console.log(this.esAdmin + ' ' + this.esSoid + ' ' + this.esEditor + ' '+ this.esLector);
        //const objectURL = URL.createObjectURL(this.fotoServ);
        //this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
     
      });
    } 
    this.loadAutores();
    this.loadCategorias();
    this.loadGeneros();
    console.log(this.categorias +' '+this.generos);
  }
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe((resp: { resultado: { _id: any; id: number; NOMBRE: string; }[]; }) => {
      this.categorias = resp.resultado;
    }, (error: any) => {
      console.error('Error loading poblaciones:', error);
    });
  }

  loadAutores(): void {
    this.autoresSevice.getAutores().subscribe((resp: { resultado: {_id: any; id: number, NOMBRE: string, apellidos: string, fecha_nacimiento: Date, nacionalidad: string, generos_autor: ArrayBuffer }[]; }) => {
      this.autores = resp.resultado;
    }, (error: any) => {
      console.error('Error loading poblaciones:', error);
    });
  }

  loadGeneros(): void {
    this.generoService.getGeneros().subscribe((resp: { resultado: { _id: any; id: number; NOMBRE: string; }[]; }) => {
      this.generos = resp.resultado;
    }, (error: any) => {
      console.error('Error loading poblaciones:', error);
    });
  }

addPoblacion(){
  if (this.poblacionForm.valid) {
      const {nombre} = this.poblacionForm.value;
      
    this.poblacionService.addPoblicacion(nombre).subscribe({
      next: (response: any) => {
          console.log('AQUIII: ', nombre);

          // Manejar la respuesta del servidor (por ejemplo, guardar el token)
          console.log('Añadido exitosamente:', response);
          this.poblacionForm.reset();
        },
      error: (error: { error: { error: string; }; }) => {
          // Manejar el error de la API
          this.errorMessage = error.error?.error || 'Error desconocido';
        }
    });
  }
}

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
    else {
      console.log("holaa aquii LECTOR: " + user)

      this.esLector =true;
    }
  }

   onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (fieldName === 'portada') {
        this.selectedPortada = file;
      } else if (fieldName === 'archivo') {
        this.selectedArchivo = file;
      }
    }
  }

  addBook(): void {
    if (this.bookForm.valid) {
      const formData = new FormData();
      
      // Añadir todos los campos del formulario
      Object.keys(this.bookForm.controls).forEach(key => {
        formData.append(key, this.bookForm.get(key)?.value);
      });
  
      // Añadir los archivos (si se han seleccionado)
      if (this.selectedPortada) {
        formData.append('files', this.selectedPortada, this.selectedPortada.name);
      }
  
      if (this.selectedArchivo) {
        formData.append('files', this.selectedArchivo, this.selectedArchivo.name);
      }
  
      // Enviar los datos al backend
      this.bookService.addBook(formData).subscribe((response: any) => {
        // Manejo de la respuesta
        this.router.navigate(['/']);
      }, (error: any) => {
        console.error('Error al añadir libro:', error);
      });
    }
  }
  
  removeFile(fieldName: string): void {
    if (fieldName === 'portada') {
      this.selectedPortada = undefined;
      (document.getElementById('portada') as HTMLInputElement).value = ''; // Limpiar el input file
    } else if (fieldName === 'archivo') {
      this.selectedArchivo = undefined;
      (document.getElementById('archivo') as HTMLInputElement).value = ''; // Limpiar el input file
    }
  }

/*addBook(): void {
  if (this.bookForm.valid) {
    const formData = new FormData();
    
    Object.keys(this.bookForm.controls).forEach(key => {
      formData.append(key, this.bookForm.get(key)?.value);
    });

    if (this.selectedFile) {
      formData.append('myFile', this.selectedFile, this.selectedFile.name);
    }

    // Convertir FormData a objeto
    const formDataObject: {[key: string]: any} = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
      
    });
    console.log('FormData Object:', formDataObject);

    this.bookService.addBook(formData).subscribe((response: any) => {
      
      this.router.navigate(['/login']);
    }, (error: any) => {
      console.error('Error during registration:', error);
    });
  }
  }*/

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
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { AutoresService } from '../services/autores.service';
import { CategoriasService } from '../services/categorias.service';
import { GenerosService } from '../services/generos.service';
import { Categoria } from '../interfaces/categoria';
import { Genero } from '../interfaces/genero';
import { Autor } from '../interfaces/autor';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit {

  baseUrl: string = 'http://localhost:3000/';
  //ADD LIBRO
  bookForm!: FormGroup;
  selectedPortada: File | undefined;
  selectedArchivo: File | undefined;
  progress = 0;
  isLoading = false; 
  generos:any[] = [];
  autores:any[] = [];
  categorias:any[] = [];
  
  //CATEGORIAS
  categoryForm!: FormGroup;


  //USUARIO LOGUEADO
  isLoggedIn: boolean = false;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;
  fotoServ: string | undefined;
  selectedSection: string | undefined | null;

  //
  librosActivos: any[] = [];
  librosNoActivos: any[] = [];
  formBuilder: any;

  constructor( private authService: AuthService, private router: Router, 
    private libroService: BookService,private categoriaService: CategoriasService,
    private autoresSevice:AutoresService, private generoService: GenerosService,
    private fb: FormBuilder){

    }

  ngOnInit(): void{
    this.checkLoginStatus();

    const token = localStorage.getItem('Bearer');
    console.log("TOKEN DEL ALMACENAMIENTO LOCAL: "+ token);
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.decodedToken;
      this.authService.validateToken(token).subscribe(resp => {
        this.fotoServ = this.baseUrl+resp.usuarioLogged.AVATAR;
        this.determinarRol(resp.usuarioLogged);
        this.authService.setUsuario(resp.usuarioLogged);

        console.log(this.esAdmin + ' ' + this.esSoid + ' ' + this.esEditor + ' '+ this.esLector);
        //const objectURL = URL.createObjectURL(this.fotoServ);
        //this.photoUrl = this.sanitizer.bypanombressSecurityTrustUrl(objectURL);
     
      })
    }
    this.bookForm = this.fb.group({
      titulo: ['', Validators.required],
      id_autor: ['', Validators.required],
      portada: [''],
      categorias_libro: [[], Validators.required],  // Array vacío por defecto
      isbn: ['', Validators.required],
      fecha_publicacion: ['', Validators.required],
      generos_libro: [[], Validators.required],  // Array vacío por defecto
      descripcion: [''],
      archivo: [''],
      resenas_libro: ['']
    });

    this.categoryForm = this.fb.group({
      nombre: ['', Validators.required]
    });
    
    this.cargarLibros();
    this.loadAutores();
    this.loadCategorias();
    this.loadGeneros();
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
  irAAdministrarPerfil(): void {
    this.router.navigate(['/perfil-user']);
  }

  selectSection(section: string): void {
    // Si la sección actual está seleccionada, la deselecciona; de lo contrario, selecciona la nueva
    if (this.selectedSection === section) {
      this.selectedSection = null; // Cerrar la sección si ya está seleccionada
    } else {
      this.selectedSection = section; // Abrir la nueva sección
    }
  }

  cargarLibros(): void {
    this.libroService.getBooks().subscribe((response: any) => {
      if (response.ok) {
        this.librosActivos = response.resultado.ACTIVOS;
        this.librosNoActivos = response.resultado.NO_ACTIVOS;
      }
    }, (error) => {
      console.error('Error al cargar libros', error);
    });
  }


  cambiarEstadoLibro(libroId: string): void {
    const confirmacion = confirm('¿Estás seguro de que deseas cambiar el estado de este libro?');
  
    if (confirmacion) {
      // Si el usuario acepta, realiza la actualización
      this.libroService.cambiarEstadoLibro(libroId).subscribe(
        (response) => {
          if (response.ok) {
            console.log(response.resultado);
            this.cargarLibros(); // Recargar los datos de los libros
          } else {
            console.error('Error:', response.resultado);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      // Si el usuario cancela, no se realiza ninguna acción
      console.log('La acción ha sido cancelada.');
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

  // Método para añadir una categoría
  addCategory(): void {
    if (this.categoryForm.valid) {
      this.categoriaService.addCategoria(this.categoryForm.value).subscribe(
        (response) => {
          console.log('Categoría añadida:', response);
          this.loadCategorias(); // Recargar las categorías después de añadir una nueva
          this.categoryForm.reset(); // Limpiar el formulario
        },
        (error) => {
          console.error('Error al añadir categoría:', error);
        }
      );
    }
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

      // Inicializar el progreso
      this.progress = 0;
      this.isLoading = true;
      console.log(formData);
      // Enviar los datos al backend
      this.libroService.addBook(formData, {
        reportProgress: true,  // Habilitar el reporte de progreso
        observe: 'events'      // Observar todos los eventos durante la subida
      }).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calcular el progreso de la subida
            this.progress = Math.round(100 * event.loaded / (event.total ?? 1));
          } else if (event.type === HttpEventType.Response) {
            // Manejo de la respuesta
            // Resetear el progreso
            this.progress = 0;
            this.isLoading = false;

            // Cerrar el modal
            this.hideModal();
              
            // Limpiar el formulario
            this.bookForm.reset();

            // Limpiar los archivos seleccionados
            this.selectedPortada = undefined;
            this.selectedArchivo = undefined;

            // Actualizar la lista de libros en el home
             this.updateBookList();

            // Navegar de vuelta al home
            this.router.navigate(['/']);
          }
        },
        error => {
          console.error('Error al añadir libro:', error);
          this.progress = 0; 
          this.isLoading = false;// Reiniciar el progreso en caso de error
        }
      );
    }
  }
  hideModal(): void {
    const modalElement = document.getElementById('addBookModal');
    if (modalElement) {
      
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
  updateBookList(): void {
    this.libroService.getBooks().subscribe(response => {     
         
      this.librosActivos = response.resultado.ACTIVOS;
      this.librosNoActivos = response.resultado.NO_ACTIVOS;

      console.log("aquiiiiii: "+response.resultado)
    }, (error: any) => {
      console.error('Error al obtener la lista de libros:', error);
    });
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
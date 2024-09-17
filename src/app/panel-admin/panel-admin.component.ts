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
  selectedLibro: any;
  
  //CATEGORIAS
  categoryForm!: FormGroup;
  editLibroForm!: FormGroup;
  showCategorias: boolean = false; //
  showCategorySearch = false;
  selectedCategoryId!: string;
  libros: any[]=[]// Se llenará con los libros de la categoría seleccionada

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
  showModal: boolean = false;
  librosActivos: any[] = [];
  librosNoActivos: any[] = [];
  formBuilder: any;
  mostrarLibrosNoActivos: boolean = false;
  mostrarLibrosActivos: boolean = false;
  

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
      nombre: ['',[ Validators.required, Validators.minLength(3)]]
    });

    this.editLibroForm = this.fb.group({
      titulo: ['', Validators.required],
      id_autor: ['', Validators.required],
      portada: [''],
      categorias_libro: [[], Validators.required],  // Array vacío por defecto
      isbn: ['', Validators.required],
      fecha_publicacion: ['', Validators.required],
      generos_libro: [[], Validators.required],  // Array vacío por defecto
      descripcion: [''],
      archivo: [''],
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
  /*TODO LIBROS */
  selectSection(section: string): void {
    // Si la sección actual está seleccionada, la deselecciona; de lo contrario, selecciona la nueva
    if (this.selectedSection === section) {
      this.selectedSection = null; // Cerrar la sección si ya está seleccionada
    } else {
      this.selectedSection = section; // Abrir la nueva sección
    }
  }

  cargarLibros(): void {
    try{
      this.libroService.getBooksActivos().subscribe((response: any) => {
        if (response.ok) {
          
          this.librosActivos = response.resultado;
          
          console.log('Libros activos: '+this.librosActivos)
        }
             
      })
      this.libroService.getBooksNoActivos().subscribe((response: any) => {
        if (response.ok) {
          
          this.librosNoActivos = response.resultado;
          
          console.log('Libros NO activos: '+this.librosNoActivos)
        } 
        else{
          this.librosNoActivos = []
        }    
      })
      

  }
    catch (error) {
      console.error('Error decoding JWT:', error);
      
    }
    
    
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
            this.cargarLibros(); // Recargar los datos de los libros
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

  openModal(libro: any) {
    this.selectedLibro = libro;
    this.showModal = true;
// Rellenar el formulario con los datos del libro
this.editLibroForm.patchValue({
  titulo: libro.titulo,
  id_autor: libro.id_autor?._id, // Asegúrate de que el id exista
  categorias_libro: libro.categorias_libro.map((cat: any) => cat._id), // Selecciona solo los IDs
  generos_libro: libro.generos_libro.map((gen: any) => gen._id), // Selecciona solo los IDs
  isbn: libro.isbn,
  fecha_publicacion: libro.fecha_publicacion,
  descripcion: libro.descripcion
});
  
  }

  closeModal() {
    this.showModal = false;
    this.editLibroForm.reset();
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.editLibroForm.valid) {
      const formData = new FormData();
      formData.append('titulo', this.editLibroForm.value.titulo);
      formData.append('id_autor', this.editLibroForm.value.id_autor);
      formData.append('categorias_libro', this.editLibroForm.value.categorias_libro);
      formData.append('generos_libro', this.editLibroForm.value.generos_libro);
      formData.append('isbn', this.editLibroForm.value.isbn);
      formData.append('fecha_publicacion', this.editLibroForm.value.fecha_publicacion);
      formData.append('descripcion', this.editLibroForm.value.descripcion);

      // Añadir archivos si existen
      if (this.selectedPortada) {
        formData.append('portada', this.selectedPortada);
      }
      if (this.selectedArchivo) {
        formData.append('archivo', this.selectedArchivo);
      }

      // Aquí llamas a tu servicio para enviar los datos a la API
      this.actualizarLibro(formData, this.editLibroForm.value.id);
    }
  }

  cambiarPortada(){
    
  }

   // Método para actualizar el libro (llamada al servicio)
   actualizarLibro(data: FormData, bookId: string) {
    // Suponiendo que tienes un servicio llamado 'libroService'
    this.libroService.updateLibro(bookId, data).subscribe(
      response => {
        console.log('Libro actualizado', response);
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar el libro', error);
      }
    );
  }

  async saveChanges() {
    if (this.editLibroForm.valid) {
      const updatedData = this.editLibroForm.value;
      const libroId = this.selectedLibro._id;
  
      // Aquí puedes hacer la llamada a tu API para actualizar el libro
      try {
        await this.libroService.updateLibro(libroId, updatedData);
        this.closeModal();
        // Actualizar la lista de libros o notificar al usuario
      } catch (error) {
        console.error('Error al actualizar el libro:', error);
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

  confirmAddCategory(): void {
    const nombreCategoria = this.categoryForm.get('nombre')?.value;
    if (this.categoryForm.valid) {
      // Mostrar la alerta de confirmación
      const confirmed = window.confirm(`¿Está seguro que quiere añadir la categoría "${nombreCategoria}"?`);
      if (confirmed) {
        this.addCategory(); // Si se confirma, añadir la categoría
      }
    } else {
      // Marcar el campo como tocado si no es válido para mostrar el mensaje de error
      this.categoryForm.markAllAsTouched();
    }
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe((resp: { resultado: { _id: any; id: number; NOMBRE: string; }[]; }) => {
      this.categorias = resp.resultado;
    }, (error: any) => {
      console.error('Error loading poblaciones:', error);
    });
  }
  mostrarCategorias(): void {
    // Alternar la visibilidad de la tabla de categorías
    this.showCategorias = !this.showCategorias;

    // Si se decide mostrar la tabla, cargar las categorías
    if (this.showCategorias) {
      this.loadCategorias();
    }
  }

  async loadBooksByCategory() {
    if (this.selectedCategoryId) {
      await this.categoriaService.getLibrosByCategoria(this.selectedCategoryId).subscribe((data) => {
        this.libros = data.resultado;
      });
    }
  }

  irLeerLibro(bookId: any){

    //const file: string =this.baseUrl+book;
    if (bookId) {
      //this.pdfService.setPdfFile(bookId);

      this.router.navigate(['/book-reader', bookId]);

    }
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
             this.cargarLibros();

            // Navegar de vuelta al home
            this.router.navigate(['/panel-admin']);
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



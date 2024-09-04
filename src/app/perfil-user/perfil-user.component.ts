import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';
import bootstrap from 'bootstrap';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.css'
})
export class PerfilUserComponent implements OnInit {
  baseUrl: string = 'http://localhost:3000/';
  isLoggedIn: boolean = true;
  userProfileImage: string | undefined;
  fotoServ: string | undefined;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  libros_usuario: [] =[];
  usuario: any;
  password: string = '';
  password2: string = '';
  usuarioForm:FormGroup | undefined;
  showForm: boolean = false;
  selectedFile: File | null = null;

  constructor(private userService : UserService, private authService: AuthService,
    private bookService: BookService, private router: Router, private usuarioService: UserService,
    private http: HttpClient
  ){}
  
  ngOnInit(): void {
    
    this.checkLoginStatus();
    this.usuario = this.authService.getUsuario();

    const token = localStorage.getItem('Bearer');;
    //this.loadUserData();

    if (token) {
      const decodedToken: any = jwt_decode(token);
      const userId = decodedToken.decodedToken;
      this.authService.validateToken(token).subscribe(resp => {
        this.fotoServ = this.baseUrl+resp.usuarioLogged.AVATAR;
        this.determinarRol(resp.usuarioLogged);
        //this.loadUserData(resp.usuarioLogged._id);

        console.log(this.esAdmin + ' ' + this.esSoid + ' ' + this.esEditor + ' '+ this.esLector);
        //const objectURL = URL.createObjectURL(this.fotoServ);
        //this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
     
      });
    } 

    
  }
  ngAfterViewInit() {
    // Aquí puedes verificar que passwordModal esté disponible
    /*if (this.passwordModal) {
      console.log('passwordModal está disponible');
    } else {
      console.error('passwordModal no está disponible');
    }*/
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
            this.bookService.getBooksActivosAddedUser(response.usuarioLogged._id).subscribe(response =>{
              this.libros_usuario = response.resultado;
            })
          this.isLoggedIn = response.valid;
          if (this.isLoggedIn) {
            // Obtener la imagen de perfil del usuario (esto puede variar según tu implementación)
            this.usuario = response.usuarioLogged;
            this.userProfileImage = response.usuarioLogged.AVATAR; // Cambia esto por la URL de la imagen del perfil
          }
        },
        error: () => {
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        }
      });
    }
  }

  

  logout() {
    console.log("Logout button clicked!");
    this.isLoggedIn = false;
    // Redireccionar a la página de login
    this.authService.logout();
    this.router.navigate(['/login']);
    
  }
  isLogged() {
    return this.authService.isLoggedIn;
  }
  isLector(user: { ROLE: string | string[]; }){
    return user.ROLE.includes('lector');
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
    if (this.isLector(user)) {
      console.log("holaa aquii LECTOR: " + user)
      this.esLector =true;
    }
  }
// Función para mostrar u ocultar el formulario
toggleForm(): void {
  console.log(this.showForm);
  this.showForm = !this.showForm;
  this.password='';
  this.password2='';
}

  guardarCambios() {
    if (this.password === this.password2) {
      console.log('Las contraseñas coinciden. Guardando cambios...');
      
      // Aquí puedes añadir la lógica para enviar la nueva contraseña al servidor
      this.usuarioService.changePassword(this.usuario._id, this.password)
      .subscribe(response => {
        console.log('Contraseña cambiada exitosamente', response);
        this.showForm = false;
        this.password='';
        this.password2='';

        // Aquí puedes manejar lo que ocurre después de un cambio exitoso, como notificar al usuario
      }, error => {
        console.error('Error al cambiar la contraseña', error);
        // Aquí puedes manejar el error y mostrar un mensaje al usuario si algo sale mal
      });
    
       // Cerrar el modal usando Bootstrap
       //this.hideModal();
    }else {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
    }
  }
   // Este método se llama cuando se selecciona un archivo
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Este método se llama al hacer clic en el botón "Guardar Avatar"
  guardarAvatar() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile); // 'avatar' es el nombre del campo que espera el backend
      //TODO - LLAMAR AL SERRVICIO PARA CAMBIAR LA FOTO

    } else {
      console.error('No se ha seleccionado ningún archivo');
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
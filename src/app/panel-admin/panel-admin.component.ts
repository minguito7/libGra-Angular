import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit {

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
  selectedSection!: string;
  //
  librosActivos: any[] = [];
  librosNoActivos: any[] = [];

  constructor( private authService: AuthService, private router: Router, private libroService: BookService){}

  ngOnInit(){
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
    this.cargarLibros();
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
    this.selectedSection = section;
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


  eliminarLibro(libroId: string): void {
    if (confirm('¿Estás seguro de que deseas desactivar este libro?')) {
      this.libroService.deleteLibro(libroId).subscribe(
        (response) => {
          console.log('respuesta de la api: '+response);
          if (response.resultado === 'Libro desactivado correctamente') {
            console.log('Libro desactivado:', response);
            this.cargarLibros(); // Recargar los datos de los libros
          } else {
            console.error('Error al desactivar el libro:', response);
          }
        },
        (error) => {
          console.error('Error al desactivar el libro:', error);
        }
      );
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
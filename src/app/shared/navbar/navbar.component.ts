import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar tu servicio de autenticación
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  baseUrl: string = 'http://localhost:3000/';

  isLoggedIn: boolean = false;
  userProfileImage: string | null = null;
  usuario !: Usuario;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;

  constructor(private authService: AuthService,private router: Router) {
    this.checkLoginStatus();
   }

  ngOnInit(): void {
    this.checkLoginStatus();
    console.log(this.isLoggedIn);

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    })
  }

  ngAfterViewInit(){
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('Bearer');
    if (token) {
      // Aquí podrías llamar a tu servicio para verificar el token
      this.authService.validateToken(token).subscribe({
        next: (response: {
          usuarioLogged: any; valid: boolean; 
          }) => {
          //console.log(response.usuarioLogged.AVATAR);
          this.isLoggedIn = response.valid;
          if (this.isLoggedIn) {
            this.determinarRol(response.usuarioLogged)

            // Obtener la imagen de perfil del usuario (esto puede variar según tu implementación)
            this.userProfileImage = response.usuarioLogged.AVATAR; // Cambia esto por la URL de la imagen del perfil
            console.log(this.userProfileImage);

          }
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
    }
  }
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']); 

  }

  isLogged() {
    return this.authService.isLoggedIn$;
  }
  irAPerfilUsu(){
    //console.log("Yendo a leer el libro: "); 
    this.router.navigate(['/perfil-user']); 
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
      console.log("holaa aquii LECTOR: " + user)

      this.esLector =true;
    }

  }
}

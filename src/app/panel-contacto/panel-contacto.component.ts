import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario';

@Component({
  selector: 'app-panel-contacto',
  templateUrl: './panel-contacto.component.html',
  styleUrl: './panel-contacto.component.css'
})
export class PanelContactoComponent {
  contactForm!: FormGroup;

  //USUARIO LOGUEADO - principal
  isLoggedIn: boolean = false;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;
  fotoServ: string | undefined;
  baseUrl: string = 'http://localhost:3000/';
  usuario!: Usuario;

  constructor(private fb: FormBuilder, private contactService: ContactService, 
    private router: Router, private authService: AuthService) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,12}$/)]],
      email: ['', [Validators.required, Validators.email]],
      sugerencia: ['', Validators.required]
    });

    this.usuario = this.authService.getUsuario();
  }
  ngOnInit() {
   

  }
  onSubmit() {
    if (this.contactForm.valid) {
      const contactData = this.contactForm.value;
      this.contactService.sendContactForm(contactData).subscribe(response => {
        console.log('Formulario enviado con éxito');
        this.contactForm.reset();
        this.router.navigate(['/']);
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
    return this.authService.isLoggedIn$;
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



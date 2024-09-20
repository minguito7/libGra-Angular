import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel-contacto',
  templateUrl: './panel-contacto.component.html',
  styleUrl: './panel-contacto.component.css'
})
export class PanelContactoComponent {
  contactForm!: FormGroup;
  //USUARIO LOGUEADO
  isLoggedIn: boolean = false;
  esAdmin: boolean = false;
  esEditor: boolean = false;
  esSoid: boolean = false;
  esLector: boolean = false;
  userProfileImage: string | undefined;
  photoUrl: any;
  fotoServ: string | undefined;

  constructor(private fb: FormBuilder, private contactService: ContactService, private router: Router) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,12}$/)]],
      email: ['', [Validators.required, Validators.email]],
      sugerencia: ['', Validators.required]
    });
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
}

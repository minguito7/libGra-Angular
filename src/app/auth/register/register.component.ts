// src/app/auth/register/register.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PoblacionService } from '../../services/poblacion.service';
import { Poblacion } from '../../interfaces/poblacion';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  selectedFile: File | null = null;
  poblaciones !: Array<Poblacion>;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private poblacionService: PoblacionService) {
    this.registerForm = this.fb.group({
      DNI: ['', [Validators.required]],
      NOMBRE: ['', [Validators.required]],
      NAMEAPP: ['', [Validators.required]],
      APELLIDOS: ['', [Validators.required]],
      EMAIL: ['', [Validators.required, Validators.email]],
      PASSWORD: ['', [Validators.required]],
      FECHANAC: ['', [Validators.required]],
      DIRECCION: [''],
      ID_POBLACION: [''],
      COD_POSTAL: [''],
      SEXO: [''],
      AVATAR: [''],
    });
  }
  ngOnInit() {
    this.loadPoblaciones();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  loadPoblaciones(): void {
    this.poblacionService.getPoblacion().subscribe(resp => {
      this.poblaciones = resp.resultado;
    }, (error: any) => {
      console.error('Error loading poblaciones:', error);
    });
  }

  registro(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      
      Object.keys(this.registerForm.controls).forEach(key => {
        formData.append(key, this.registerForm.get(key)?.value);
      });

      if (this.selectedFile) {
        console.log('Archivo seleccionado:', this.selectedFile); // Agrega esto
        formData.append('myFile', this.selectedFile, this.selectedFile.name);
      } else {
        console.warn('No hay archivo seleccionado'); // Agrega esto
      }

      console.log('Formulario válido:', this.registerForm.valid);

      

      // Convertir FormData a objeto
      const formDataObject: {[key: string]: any} = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log('FormData Object:', formDataObject);

      this.authService.registro(formData).subscribe(
        (response: any) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Error durante el registro:', error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
        }
      );
      
    }
    else{
      console.log('NO ENTRA EN EL IF DE FORMULARIO VALIDO')
    }
  }

}

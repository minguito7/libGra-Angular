import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          // Manejar la respuesta del servidor (por ejemplo, guardar el token)
          console.log('Login exitoso:', response);
          if (response?.token) {
            // Almacenar el token en el almacenamiento local
            localStorage.setItem('Bearer', response.token);
            
            // Redirigir al usuario a la página de inicio
            this.router.navigate(['/']);
          }

        },
        error: (error: { error: { error: string; }; }) => {
          // Manejar el error de la API
          this.errorMessage = error.error?.error || 'Error desconocido';
        }
      });
    }
  }
}

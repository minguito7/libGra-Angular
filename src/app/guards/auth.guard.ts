import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('Bearer');
    
    // Verificar si el token existe y es válido
    if (token) {
      // Aquí podrías añadir más validaciones si necesitas verificar el token con la API
      return true;
    } else {
      // Redirigir a la página de login si no hay token
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private _userImage = 'path_to_default_user_image';
  private usuarioLogueado!: Usuario;

  //PRUEBA
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();



  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = { EMAIL: email, PASSWORD: password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    this.isLoggedInSubject.next(true);
    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers });

  }

  registro(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, formData)
  }

  logout(): void {
    localStorage.removeItem('Bearer');
    this.isLoggedInSubject.next(false);
    
    //this._userImage = 'path_to_default_user_image'; // Restablecer la imagen a la predeterminada al cerrar sesión
  }

  getToken(): string | null {
    return localStorage.getItem('Bearer');
  }

  getUserLogueado(userId: string) {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/usuarios/${userId}`, { headers, responseType: 'blob' });
  }

// Método para validar el token
validateToken(token: string): Observable<any> {
  return this.http.get<{ valid: boolean; usuarioLogged: any }>(`${this.apiUrl}/validate-token`, {
    headers: { Authorization: `Bearer ${token}` },
  }).pipe(
    tap(response => {
      this.isLoggedInSubject.next(response.valid);
      if (response.valid) {
        this.usuarioSubject.next(response.usuarioLogged);
      } else {
        this.usuarioSubject.next(null);
      }
    })
  );
}
  setUsuario(usuario: Usuario): void {
    this.usuarioLogueado = usuario;
  }

  getUsuario(): Usuario {
    return this.usuarioLogueado;
  }

  clearUsuario(): void {
    this.usuarioLogueado = {
    _id: '',
    DNI: '',
    NOMBRE: '',
    NAMEAPP: '',
    APELLIDOS: '',
    EMAIL: '',
    PASSWORD: '',
    createdAt: new Date(),
    FECHANAC: new Date(),
    DIRECCION: '',
    ID_POBLACION:{
      nombre: '', numPoblacion: 0,
      _id: ''
    } , // Referencia al esquema de poblacion
    COD_POSTAL: '',
    TITULO1: '',
    SEXO: '',
    ROLE: '',
    ACTIVO: false,
    NUM_USUARIO: 0,
    AVATAR: "",
    AMIGOS: [],
    LIBROS: []
    };
  }
}

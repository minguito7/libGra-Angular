// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  isLoggedIn = false;
  private apiUrl = 'http://localhost:3000/auth';
  private _userImage = 'path_to_default_user_image';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = { EMAIL: email, PASSWORD: password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    this.isLoggedIn = true;
    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers });

  }

  registro(user: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, user);
  }

  logout(): void {
    localStorage.removeItem('Bearer');
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

 validateToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/validate-token`, { headers });
  }

}

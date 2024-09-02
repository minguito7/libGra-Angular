// src/app/services/book.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/libros';

  constructor(private http: HttpClient) { }

  addBook(libro: FormData, options: { reportProgress: boolean; observe: string; }): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Incluye las opciones de reportProgress y observe en la llamada HTTP
    return this.http.post(`${this.apiUrl}/add-libro`, libro, {
      headers: headers,
      reportProgress: options.reportProgress,  // Reportar progreso
      observe: options.observe as 'events'     // Observar todos los eventos
    });
  }
  
  getBooks(): Observable<any> {
   console.log('golaa');
    return this.http.get(`${this.apiUrl}`);
  }
  getBooksActivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activos`);
  }

  getNovedadesLibros(): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/novedades-libros`, { headers});
  

  }
}

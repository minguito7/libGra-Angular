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
    console.log(libro)
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

  getOneBook(bookId:string): Observable<any>{
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${bookId}`, { headers});
  }

  getArchivoBook(bookId:string): Observable<any>{
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/devolver-url/${bookId}`, { headers });
  }
  getBooksActivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activos`);
  }

  getBooksNoActivos(): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/no-activos`, { headers});
  }

  getBooksActivosAddedUser(id_user: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/activos/${id_user}`);
  }

  getNovedadesLibros(): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/novedades-libros`, { headers});
    }

  getArchivoLibro(bookId:string): Observable<any> {
      const token = localStorage.getItem('Bearer');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/descargar-libro/${bookId}`, { 
        headers: headers,
        responseType: 'blob'
      });
      }

  cambiarEstadoLibro(bookId: string): Observable<any> {
        const token = localStorage.getItem('Bearer');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put(`${this.apiUrl}/cambiar-estado/${bookId}`,{}, { headers });
      }

  updateLibro(libroId: string, data: FormData): Observable<any> {
    const token = localStorage.getItem('Bearer');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log(libroId)
        
        return this.http.put(`${this.apiUrl}/edit-libro/${libroId}`, data ,{headers, responseType: 'blob'})
  }
     
}

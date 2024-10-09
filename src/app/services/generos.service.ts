import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {
  private apiUrl = 'http://localhost:3000/generos';

  constructor(private http: HttpClient) { }

  getGeneros(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addGenero(genero: FormData): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${this.apiUrl}/add-genero`, genero, {headers});
  }
}

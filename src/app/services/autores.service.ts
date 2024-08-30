import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  private apiUrl = 'http://localhost:3000/autores';

  constructor(private http: HttpClient) { }

  getAutores(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addAutores(nombre: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-autor`, {nombre});
  }
}

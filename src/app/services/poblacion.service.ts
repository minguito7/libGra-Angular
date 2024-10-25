import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoblacionService {

  private apiUrl = 'http://localhost:3000/poblaciones';

  constructor(private http: HttpClient) { }

  getPoblacion(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addPoblacion(nombre: String): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add-poblacion`, nombre , {headers});
  }

}

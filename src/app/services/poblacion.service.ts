import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoblacionService {

  private apiUrl = 'http://localhost:3000/poblaciones';

  constructor(private http: HttpClient) { }

  getPoblicaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addPoblicacion(nombre: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-poblacion`, {nombre});
  }

}

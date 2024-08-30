import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addCategoria(nombre: String): Observable<any> {
    const body = { NOMBRE : nombre};
    return this.http.post(`${this.apiUrl}/add-categoria`, {nombre});
  }
}

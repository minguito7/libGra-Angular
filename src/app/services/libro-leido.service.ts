import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroLeidoService {
  private apiUrl = 'http://localhost:3000/libros-leidos';
  constructor(private http: HttpClient) { }

  //VER LOS MARCAPAGINAS DE UN LIBRO DE UN USUARIO
  getBookMarkets(idUsuario : any,idLibro : any){
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}/${idUsuario}/${idLibro}`, { headers});
  }

  //TODOS LOS LIBROS LEIDOS POR UN USUARIO
  getLibrosLeidosUsuario(idUsuario: any): Observable<any> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Verifica que la URL sea correcta
    console.log('API URL:', `${this.apiUrl}/usuario/${idUsuario}`);
    
    return this.http.get(`${this.apiUrl}/usuario/${idUsuario}`, { headers });
  }
  

  getComprobacionBookMarketPagina(idUsuario : any,idLibro : any, pagina_actual:any){
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/comprobar-pagina/${idUsuario}/${idLibro}`,{
      headers,
      params: { pagina_actual }
    });
  }

  postBookMarket(libro: any){
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {libro}
    // Incluye las opciones de reportProgress y observe en la llamada HTTP
    return this.http.post(`${this.apiUrl}/add-libro-leido`, libro, {headers});
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  getUsuario(userId: string) {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${userId}`, { headers, responseType: 'blob' });
  }

  changePassword(userId: string, password: string){   
      const token = localStorage.getItem('Bearer');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log('Guardando la contraseña en el usuario... ');
      const body = { PASSWORD: password };

      return this.http.post(`${this.apiUrl}/edit-password/${userId}`, body, { headers, responseType: 'blob' });
  }

  changeAvatar(userId: string, avatar: string){   
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Guardando la contraseña en el usuario... ');
    const body = { AVATAR: avatar };

    return this.http.post(`${this.apiUrl}/modify-avatar/${userId}`, body, { headers, responseType: 'blob' });
}
  

}

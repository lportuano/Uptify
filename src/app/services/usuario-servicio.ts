import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  
  private http = inject(HttpClient);

  private API_URL = 'https://web-2-7fc6d-default-rtdb.firebaseio.com';

  /*metodo GET
  getUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL)
  }*/

  // GET: Obtener todos los usuarios
  getUsuario(): Observable<Usuario[]> {
    return this.http.get<{ [key: string]: Usuario }>(`${this.API_URL}/usuarios.json`).pipe(
      map((respuesta) => {
        if (!respuesta) return [];
        return Object.keys(respuesta).map((id) => ({
          ...respuesta[id],
          id: id,
        }));
      }),
    );
  }

  //metodo POST
  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios.json`, usuario);
  }

  //metodo buscar por ID
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}.json`);
  }

  //metodo PUT
  putUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}.json`, usuario);
  }

  //metodo DELETE
  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}.json`);
  }
}

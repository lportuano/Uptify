import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8080/usuarios';

  //metodo GET
  getUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL)
  }

  // // GET: Obtener todos los usuarios
  // getUsuario(): Observable<Usuario[]> {
  //   return this.http.get<{ [key: string]: Usuario }>(`${this.API_URL}/usuarios.json`).pipe(
  //     map((respuesta) => {
  //       if (!respuesta) return [];
  //       return Object.keys(respuesta).map((id) => ({
  //         ...respuesta[id],
  //         id: id,
  //       }));
  //     }),
  //   );
  // }

  //metodo POST
  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/registrarUsuario`, usuario);
  }

  //metodo buscar por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  //metodo PUT
  putUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  //metodo DELETE
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  actualizarSuscripcion(id: number, nombrePlan: string): Observable<any> {

    const body = { nombrePlan: nombrePlan };
    return this.http.put<any>(`${this.API_URL}/${id}/plan`, body);
  }
}

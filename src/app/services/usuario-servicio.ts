import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/usuarios';

  /**
   * Obtiene el ID del usuario logueado desde el localStorage para la auditoría.
   */
  private getAutorHeaders(): HttpHeaders {
    const idLogueado = localStorage.getItem('usuarioId');
    // Si no existe, enviamos 0 para evitar errores en el backend
    return new HttpHeaders().set('X-Usuario-Id', idLogueado || '0');
  }

  // Metodo GET
  getUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  // Metodo POST (Registro inicial, no requiere header de autor)
  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/registrarUsuario`, usuario);
  }

  // Metodo buscar por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  // Metodo PUT - MODIFICADO para enviar el Header
  putUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const headers = this.getAutorHeaders();
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario, { headers });
  }

  // Metodo DELETE - MODIFICADO para enviar el Header
  deleteUsuario(id: number): Observable<void> {
    const headers = this.getAutorHeaders();
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers });
  }

  actualizarSuscripcion(id: number, nombrePlan: string): Observable<any> {
    const body = { nombrePlan: nombrePlan };
    return this.http.put<any>(`${this.API_URL}/${id}/plan`, body);
  }

  // --- Metodo para Reportar Error (Stored Procedure) ---
  reportarError(usuarioId: number, descripcion: string, modulo: string): Observable<any> {
    const payload = { usuarioId, descripcion, modulo };
    return this.http.post(`${this.API_URL}/reportar-error`, payload);
  }
}
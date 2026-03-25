import { inject, Injectable, signal } from '@angular/core';
import { UsuarioServicio } from './usuario-servicio';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private servicioUsuario = inject(UsuarioServicio);
  private http = inject(HttpClient);

  sesionIniciada = signal<boolean>(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
  );

  rolActual = signal<string | null>(null);

  private API_URL = 'http://localhost:8080/login';

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          // 1. Limpiamos rastros viejos para evitar conflictos
          localStorage.clear();

          // 2. Guardamos el Token de seguridad
          localStorage.setItem('token', res.token);

          /**
           * 3. CORRECCIÓN DEL ID:
           * Intentamos capturar el ID de las formas más comunes en Spring Boot.
           * Si tu Backend lo envía como 'id', 'usuarioId' o dentro de un objeto 'user'.
           */
          const idExtraido = res.id || res.usuarioId || (res.usuario && res.usuario.id);

          if (idExtraido) {
            localStorage.setItem('usuarioId', idExtraido.toString());
          } else {
            console.error('El Backend no envió un ID de usuario válido en la respuesta.');
          }

          // 4. Actualizamos el estado de la aplicación
          this.sesionIniciada.set(true);
          this.rolActual.set(res.rol);
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
  }
}
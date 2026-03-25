import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; // Importamos la librería

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  sesionIniciada = signal<boolean>(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
  );

  // El signal ahora obtiene su valor inicial decodificando el token
  rolActual = signal<string | null>(this.obtenerRolDelToken());

  private API_URL = 'http://localhost:8080/login';

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.clear();
          localStorage.setItem('token', res.token);

          const idExtraido = res.id || res.usuarioId || (res.usuario && res.usuario.id);
          if (idExtraido) {
            localStorage.setItem('usuarioId', idExtraido.toString());
          }

          this.sesionIniciada.set(true);
          // Actualizamos el signal inmediatamente después del login
          this.rolActual.set(this.obtenerRolDelToken());
        }
      })
    );
  }

  // FUNCIÓN CLAVE: Extrae el rol del token JWT
  private obtenerRolDelToken(): string | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      // 'sub' o 'role' suelen ser los nombres de los campos en el JWT
      // Revisa tu backend para ver si el campo se llama 'role', 'roles' o 'sub'
      return decoded.role || decoded.roles || null;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return null;
    }
  }

  logout() {
    localStorage.clear();
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
  }
}
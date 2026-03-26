import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Estado de la sesión
  sesionIniciada = signal<boolean>(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
  );

  // El signal del rol/plan se inicializa intentando decodificar el token guardado
  rolActual = signal<string | null>(this.obtenerRolDelToken());

  private API_URL = 'http://localhost:8080/login';

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          // 1. Limpieza total para evitar conflictos de sesiones anteriores
          localStorage.clear();

          // 2. Guardar Token
          localStorage.setItem('token', res.token);

          // 3. Guardar ID de usuario (Probamos todas las variantes del Backend)
          const idExtraido = res.id || res.usuarioId || (res.usuario && res.usuario.id);
          if (idExtraido) {
            localStorage.setItem('usuarioId', idExtraido.toString());
          }

          // 4. Guardar el Rol/Plan explícito si el backend lo envía fuera del token
          // Esto ayuda si la tabla de admin depende de 'res.rol'
          if (res.rol) {
            localStorage.setItem('user_role', res.rol);
          }

          // 5. Actualizar Signals
          this.sesionIniciada.set(true);

          // Prioridad: Si el backend envía el rol en el JSON lo usamos, 
          // si no, lo extraemos del Token decodificado.
          const rolParaSignal = res.rol || this.obtenerRolDelToken();
          this.rolActual.set(rolParaSignal);

          console.log("Login exitoso. Rol/Plan establecido:", rolParaSignal);
        }
      })
    );
  }

  /**
   * Extrae la información del Rol o Plan desde el cuerpo del JWT.
   */
  private obtenerRolDelToken(): string | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      return decoded.role || decoded.rol || decoded.roles || localStorage.getItem('user_role') || null;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return localStorage.getItem('user_role'); 
    }
  }

  logout() {
    localStorage.clear();
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
  }
}
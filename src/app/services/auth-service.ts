import { inject, Injectable, signal } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { UsuarioServicio } from './usuario-servicio';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private servicioUsuario = inject(UsuarioServicio);
  private http = inject(HttpClient);

  // Cambiamos la lógica de los signals para que dependan del token, no de strings manuales
  sesionIniciada = signal<boolean>(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
  );

  // El rol ya no lo leeremos de una clave 'rol', sino que podrías extraerlo del token (JWT) si fuera necesario
  rolActual = signal<string | null>(null);

  private API_URL = 'http://localhost:8080/login';

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          // 1. Limpiamos cualquier rastro viejo
          localStorage.clear();

          // 2. Guardamos SOLO el token
          localStorage.setItem('token', res.token);

          // 3. Actualizamos el estado
          this.sesionIniciada.set(true);

          this.rolActual.set(res.rol);
        }
      })
    );
  }

  logout() {
    // Limpia todo de golpe
    localStorage.clear();

    this.sesionIniciada.set(false);
    this.rolActual.set(null);


  }
}

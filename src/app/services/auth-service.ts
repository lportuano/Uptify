import { inject, Injectable, signal } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { UsuarioServicio } from './usuario-servicio';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private servicioUsuario = inject(UsuarioServicio);
  private http = inject(HttpClient);

  sesionIniciada = signal<boolean>(
    typeof window !== 'undefined' ? localStorage.getItem('sesion') === 'true' : false
  );

  rolActual = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('rol') : null
  );

  private API_URL = 'http://localhost:8080/login';

  login(email: string, passw: string): Observable<boolean> {
    return this.http.post<Usuario | null>(this.API_URL, { email, password: passw }).pipe(
      map(usuarioCoincide => {
        if (usuarioCoincide) {
          localStorage.setItem('sesion', 'true');
          localStorage.setItem('user', JSON.stringify(usuarioCoincide));
          localStorage.setItem('rol', usuarioCoincide.rol);

          // Guardar en postgree datos
          if (usuarioCoincide.id) {
            localStorage.setItem('usuarioId', usuarioCoincide.id.toString());
          }

          this.rolActual.set(usuarioCoincide.rol);
          this.sesionIniciada.set(true);
          return true;
        }
        return false;
      })
    )
  }

  logout() {
    localStorage.removeItem('sesion');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioId');

    this.sesionIniciada.set(false);
    this.rolActual.set(null);
  }

}

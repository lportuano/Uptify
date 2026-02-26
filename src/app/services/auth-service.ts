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
    return this.http.post<Usuario | null>(this.API_URL,{email, password: passw}).pipe(
      map(usuarioCoincide => {
        if(usuarioCoincide){
          localStorage.setItem('sesion', 'true');
          //guardar los datos convirtiendo el objeto json a texto
          localStorage.setItem('user', JSON.stringify(usuarioCoincide));

          //guardar el ROL
          localStorage.setItem('rol', usuarioCoincide.rol);
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
    
    this.sesionIniciada.set(false);
    this.rolActual.set(null)
  }

}

import { inject, Injectable, signal } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { UsuarioServicio } from './usuario-servicio';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private servicioUsuario = inject(UsuarioServicio);

  //localstorage
  sesionIniciada = signal<boolean>(localStorage.getItem('sesion') === 'true');

  //Accedemos al rol del usuario
  rolActual = signal<string | null>(localStorage.getItem('rol'));

  login(email: string, password: string): Observable<boolean> {
    return this.servicioUsuario.getUsuario().pipe(
      map(usuarios => {
        const usuarioCoincide = usuarios.find(u => u.email === email && u.password === password);
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
    this.sesionIniciada.set(false);
    localStorage.removeItem('rol');
    this.rolActual.set(null)
  }

}

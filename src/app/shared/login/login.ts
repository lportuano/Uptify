import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';

  private servicioAuth = inject(AuthService);

  private router = inject(Router)

  // El rol ya no lo leeremos de una clave 'rol', sino que podrías extraerlo del token (JWT) si fuera necesario
  rolActual = signal<string | null>(null);


  iniciarSesion() {
    this.servicioAuth.login(this.email, this.password).subscribe({

      //Se activa si la respuesta de la api fue 200 OK.
      next: (res) => {
        alert('Registro exitoso');
        this.rolActual.set(res.rol);

        if (this.rolActual() === "ROLE_ADMIN") {
          console.log(this.rolActual);
          this.router.navigate(['/registro']);
        }else{
        this.router.navigate(['/planes']);
        }
      },
      //Se activa si la api rechazó la petición 403, 404, 500.
      error: () => alert('Usuario o contraseña incorrectos')
    });


  }


  cerrarSesion() {
    this.servicioAuth.logout();
    alert('Sesion cerrada');
    this.router.navigate(['/']);
  }

}

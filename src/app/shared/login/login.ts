import { Component, Inject, inject } from '@angular/core';
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

  email:string='';
  password:string='';

  private servicioAuth = inject(AuthService);

  private router = inject(Router)

  iniciarSesion(){
    this.servicioAuth.login(this.email, this.password).subscribe(success =>{
      if(success){
        alert('Bienvenido al sistema');
        this.router.navigate(['/perfil']);
      }else{
        alert('Error: usuario no autenticado');
      }
    });
  }

  cerrarSesion(){
    this.servicioAuth.logout();
    alert('Sesion cerrada');
  }

}

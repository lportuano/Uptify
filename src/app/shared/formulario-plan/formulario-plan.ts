import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario-plan.html',
  styleUrl: './formulario-plan.css'
})
export class FormularioPlan {

  nombre: string = '';
  email: string = '';
  planSeleccionado: string = 'Gratuito';


  private usuarioService = inject(UsuarioServicio);
  private router = inject(Router);

  contratarAhora() {
    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
      alert('Sesión no encontrada');
      return;
    }


    const payload = {
      nombrePlan: this.planSeleccionado 
    };

    console.log('Enviando este objeto:', payload);

    this.usuarioService.actualizarSuscripcion(Number(userId), payload.nombrePlan).subscribe({
      next: (res) => {
        alert('¡Suscripción actualizada con éxito!, SI ACTUALIZASTE A UN PLAN PREMIUM DEBES VOLVER A INICIAR SESION');
        this.router.navigate(['/musica']);
      },
      error: (err) => {
        console.error('El servidor rechazó la petición:', err);

        alert('Error 400: Revisa que el plan exista en la base de datos.');
      }
    });
  }
}
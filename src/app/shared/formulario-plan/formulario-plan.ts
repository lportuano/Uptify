import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service'; 

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
  private authService = inject(AuthService); 
  private router = inject(Router);

  contratarAhora() {
    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
      alert('Sesión no encontrada. Por favor, inicia sesión.');
      return;
    }

    const payload = {
      nombrePlan: this.planSeleccionado
    };

    console.log('Enviando este objeto:', payload);

    this.usuarioService.actualizarSuscripcion(Number(userId), payload.nombrePlan).subscribe({
      next: (res) => {
        // 1. Informamos al usuario
        alert('¡Suscripción actualizada con éxito! Para aplicar los cambios, inicia sesión nuevamente.');

        // 2. FORZAMOS EL LOGOUT: Esto limpia el token viejo del storage
        this.authService.logout();

        // 3. REDIRIGIMOS AL LOGIN: Al entrar de nuevo, el servidor le dará el token Premium
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('El servidor rechazó la petición:', err);
        alert('Error 400: Revisa que el plan exista en la base de datos.');
      }
    });
  }
}
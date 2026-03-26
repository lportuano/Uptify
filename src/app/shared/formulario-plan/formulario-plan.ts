import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Cambiamos a Reactive
import { CommonModule } from '@angular/common';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service'; 

@Component({
  selector: 'app-plan-form',
  standalone: true,
  // IMPORTANTE: Cambiamos FormsModule por ReactiveFormsModule y añadimos CommonModule
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './formulario-plan.html',
  styleUrl: './formulario-plan.css'
})
export class FormularioPlan implements OnInit {
  // Inyecciones
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioServicio);
  private authService = inject(AuthService); 
  private router = inject(Router);

  // Variables de estado
  planForm!: FormGroup;
  planSeleccionado: string = 'Gratuito';

  ngOnInit() {
    // Definimos las validaciones interestelares
    this.planForm = this.fb.group({
  // Ahora permite 16 números y opcionalmente espacios entre ellos
  numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9 ]{16,19}$')]],
  expiracion: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
  cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
});
  }

  // En tu archivo .ts agrega este método
formatearTarjeta(event: any) {
  let valor = event.target.value.replace(/\D/g, ''); // Quita lo que no sea número
  let formateado = '';

  for (let i = 0; i < valor.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formateado += ' '; // Agrega espacio cada 4 números
    }
    formateado += valor[i];
  }
  
  // Solo permitimos hasta 19 caracteres (16 números + 3 espacios)
  this.planForm.get('numeroTarjeta')?.setValue(formateado.substring(0, 19));
}

// Agrega este método a tu clase FormularioPlan
formatearExpiracion(event: any) {
  let valor = event.target.value.replace(/\D/g, ''); // Quita todo lo que no sea número
  let formateado = '';

  if (valor.length > 0) {
    // Si el primer número es mayor a 1, asumimos que es un mes de un solo dígito (ej: 5 -> 05)
    if (valor.length === 1 && parseInt(valor) > 1) {
      formateado = '0' + valor + '/';
    } else {
      formateado = valor.substring(0, 2);
      if (valor.length >= 2) {
        formateado += '/' + valor.substring(2, 4);
      }
    }
  }
  
  // Actualizamos el valor en el formulario (máximo 5 caracteres: MM/YY)
  this.planForm.get('expiracion')?.setValue(formateado.substring(0, 5), { emitEvent: false });
}

  // Método para cambiar el plan visualmente
  seleccionarPlan(plan: string) {
    this.planSeleccionado = plan;
  }

  contratarAhora() {
    // Si el formulario es inválido (faltan datos o formato erróneo)
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched(); // Marca los campos para que salgan los mensajes rojos
      alert('¡Atención! Por favor completa todos los datos de la tarjeta correctamente.');
      return;
    }

    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
      alert('Sesión no encontrada. Por favor, inicia sesión.');
      return;
    }

    // Si todo está bien, procedemos con el plan seleccionado
    console.log('Enviando suscripción:', this.planSeleccionado);
    console.log('Datos de pago (simulados):', this.planForm.value);

    this.usuarioService.actualizarSuscripcion(Number(userId), this.planSeleccionado).subscribe({
      next: (res) => {
        alert('¡Suscripción actualizada con éxito! Para aplicar los cambios, inicia sesión nuevamente.');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('El servidor rechazó la petición:', err);
        alert('Error: Revisa que el plan exista en la base de datos.');
      }
    });
  }
}
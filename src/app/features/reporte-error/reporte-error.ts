import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-error',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reporte-wrapper">
      <div class="reporte-card">
        <div class="header">
          <h3 class="gradient-text">CENTRO DE SOPORTE</h3>
          <p class="text-white/60 text-xs tracking-widest">UPTIFY DATABASE SYSTEM</p>
        </div>

        <div class="form-body">
          <label>¿En qué sección ocurrió el fallo?</label>
          <select [(ngModel)]="moduloError" class="custom-select">
            <option value="Login">Login / Acceso</option>
            <option value="Musica">Reproductor de Música</option>
            <option value="Suscripciones">Planes y Pagos</option>
            <option value="Perfil">Mi Perfil</option>
            <option value="Otro">Otro problema</option>
          </select>

          <label>Descripción del error:</label>
          <textarea 
            [(ngModel)]="errorMsg" 
            placeholder="Describe lo sucedido para que el sistema lo procese..."
            class="custom-textarea">
          </textarea>

          <button (click)="enviarReporte()" class="btn-trigger">
            EJECUTAR PROCEDIMIENTO EN BD
          </button>
          
          <button (click)="volver()" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reporte-wrapper { 
      height: 100vh; display: flex; justify-content: center; align-items: center; 
      background: #000; font-family: 'Inter', sans-serif;
    }
    .reporte-card { 
      background: rgba(255,255,255,0.03); padding: 40px; border-radius: 24px; 
      border: 1px solid rgba(76, 201, 240, 0.2); width: 450px; backdrop-filter: blur(10px);
    }
    .gradient-text {
      font-weight: 900; letter-spacing: 4px; font-size: 22px;
      background: linear-gradient(to right, #4cc9f0, #7209b7);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    label { color: #4cc9f0; font-size: 10px; font-weight: bold; letter-spacing: 2px; display: block; margin-top: 20px; text-transform: uppercase;}
    .custom-select, .custom-textarea {
      width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: white; padding: 12px; border-radius: 8px; margin-top: 8px; outline: none;
    }

    .custom-select option {
      background-color: #121212 !important; /* Fondo negro */
      color: white !important;              /* Letras blancas */
    }

    .custom-textarea { height: 120px; resize: none; }
    .btn-trigger {
      width: 100%; margin-top: 25px; padding: 15px; border-radius: 12px; border: none;
      background: linear-gradient(to right, #7209b7, #4cc9f0); color: white;
      font-weight: bold; cursor: pointer; transition: 0.3s;
    }
    .btn-trigger:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(114, 9, 183, 0.3); }
    .btn-cancel { width: 100%; background: transparent; color: white; border: none; margin-top: 10px; cursor: pointer; opacity: 0.5; font-size: 12px; }
  `]
})
export class ReporteError {
  private servicioUsuario = inject(UsuarioServicio);
  private router = inject(Router);

  errorMsg: string = '';
  moduloError: string = 'General';

  enviarReporte() {
  // CAMBIO AQUÍ: Usamos 'usuarioId' en lugar de 'id'
  const idStorage = localStorage.getItem('usuarioId'); 
  
  if (!idStorage) {
    alert('No se encuentra el ID del usuario. Inicia sesión de nuevo.');
    return;
  }

  const payload = {
    usuarioId: Number(idStorage), 
    descripcion: this.errorMsg,
    modulo: this.moduloError
  };

  this.servicioUsuario.reportarError(payload.usuarioId, payload.descripcion, payload.modulo).subscribe({
    next: () => {
      alert('¡Procedimiento ejecutado! Reporte guardado en PostgreSQL.');
      this.errorMsg = '';
    },
    error: (err) => {
      console.error("Error:", err);
      alert('Fallo al ejecutar el procedimiento en la base de datos.');
    }
  });
}

  volver() { this.router.navigate(['/']); }
}
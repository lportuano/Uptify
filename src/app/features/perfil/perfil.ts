import { Component, inject, OnInit, signal } from '@angular/core';
import { Cartas } from "../../shared/cartas/cartas";
import { Genero } from "../../shared/genero/genero";
import { Online } from "../../shared/online/online";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { UsuarioServicio } from '../../services/usuario-servicio';

@Component({
  selector: 'app-perfil',
  imports: [Cartas, Genero, Online,CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioServicio);

  // Signals para manejar la info del usuario
  usuarioInfo = signal<any>(null);
  planActual = signal<string | null>(null);

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const id = localStorage.getItem('usuarioId');
    // Obtenemos el plan directamente del token decodificado en el AuthService
    this.planActual.set(this.authService.rolActual());

    if (id) {
      this.usuarioService.getUsuarioById(Number(id)).subscribe({
        next: (data) => {
          this.usuarioInfo.set(data);
        },
        error: (err) => console.error("Error al obtener perfil:", err)
      });
    }
  }
}

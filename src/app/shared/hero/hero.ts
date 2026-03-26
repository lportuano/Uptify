import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {

  private servicioUsuario = inject(UsuarioServicio);
  public servicioAuth = inject(AuthService);
  private router = inject(Router);

  listaUsuarios = signal<Usuario[]>([]);
  editando = false;
  confirmarPassword: string = ''; // Nueva variable para validación

  @Input() subtitulo: string = '';
  @Input() usuario: string = '';
  @Input() correo: string = '';
  @Input() contrasenia: string = '';
  @Input() confirmarContrasenia: string = '';
  @Input() mostrarVideo: boolean = false;
  @Input() textoBoton: string = '';
  @Input() mostrarTabla: boolean = true;

  nuevoUsuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'ROLE_USUARIO'
  };

  ngOnInit() {
    this.obtener();
  }

  obtener() {
    this.servicioUsuario.getUsuario().subscribe((usuarios) => {
      this.listaUsuarios.set(usuarios);
    });
  }

  mensaje() {
    alert('Ya formas parte de Uptify !FELICIDADES¡');
  }

  guardarUsuario() {
    // Validación de coincidencia antes de enviar
    if (!this.editando && this.nuevoUsuario.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (this.editando && this.nuevoUsuario.id) {
      this.servicioUsuario.putUsuario(this.nuevoUsuario.id, this.nuevoUsuario).subscribe({
        next: () => {
          this.obtener();
          this.resetear();
        },
        error: (err) => this.manejarError(err)
      });
    } else {
      this.servicioUsuario.postUsuario(this.nuevoUsuario).subscribe({
        next: () => {
          this.mensaje();
          this.obtener();
          this.resetear();
        },
        error: (err) => this.manejarError(err)
      });
    }
  }

  private manejarError(err: any) {
    if (err.status === 400 || err.status === 409) {
      alert('El correo electrónico o nombre de usuario ya existe en Uptify.');
    } else {
      console.error('Error en el servidor:', err);
      alert('El correo electrónico o nombre de usuario ya existe en Uptify.');
    }
  }

  eliminarsuario(id: number) {
    if (confirm('¿Desea eliminar el registro?')) {
      this.servicioUsuario.deleteUsuario(id).subscribe(() => {
        this.obtener();
      });
    }
  }

  seleccionarParaEditar(user: Usuario) {
    this.editando = true;
    this.nuevoUsuario = { ...user };
    this.confirmarPassword = user.password || ''; 
  }

  resetear() {
    this.editando = false;
    this.confirmarPassword = '';
    this.nuevoUsuario = { nombre: '', email: '', password: '', rol: 'ROLE_USUARIO' };
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}
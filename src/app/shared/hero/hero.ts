import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

  private servicioUsuario = inject(UsuarioServicio);

  public servicioAuth = inject(AuthService);

  listaUsuarios = signal<Usuario[]>([]);

  editando = false;

  private router = inject(Router);

  @Input() subtitulo: string = '';
  @Input() usuario: string = '';
  @Input() correo: string = '';
  @Input() contrasenia: string = '';
  @Input() confirmarContrasenia: string = '';
  @Input() mostrarVideo: boolean = false;
  @Input() textoBoton: string = '';
  @Input() mostrarTabla: boolean = true;

  nuevoUsuario: Usuario = {
    name: '',
    email: '',
    password: '',
    rol: 'USUARIO'
  };

  ngOnInit() {
    this.obtener();
  }

  //crear el metodo obtener usuarios
  obtener() {
    this.servicioUsuario.getUsuario().subscribe((usuarios) => {
      this.listaUsuarios.set(usuarios);
    });
  }

  mensaje() {
    alert('Ya formas parte de Uptify !FELICIDADES¡');
  }

  //metodo GUARDAR
  guardarUsuario() {
    if (this.editando && this.nuevoUsuario.id) {
      this.servicioUsuario.putUsuario(this.nuevoUsuario.id, this.nuevoUsuario).subscribe(() => {
        this.obtener();
        this.resetear();
      });
    } else {
      this.servicioUsuario.postUsuario(this.nuevoUsuario).subscribe(() => {
        this.obtener();
        this.resetear();
      });
    }
  }

  //metodo ELIMINAR
  eliminarsuario(id: string) {
    if (confirm('¿Desea eliminar el registro ?')) {
      this.servicioUsuario.deleteUsuario(id).subscribe(() => {
        this.obtener();
      });
    }
  }

  //metodo para poner los datos en el formulario para poder editar los inputs
  seleccionarParaEditar(user: Usuario) {
    this.editando = true;
    this.nuevoUsuario = { ...user };
  }

  //metodo para limpiar los inputs (formulario)
  resetear() {
    this.editando = false;
    this.nuevoUsuario = { name: '', email: '', password: '', rol:'USUARIO' };
  }

  /*guardar usuarios
  guardarUsuario() {
    this.servicioUsuario.postUsuario(this.nuevoUsuario).subscribe(usuarioId => {
      //... spread operator: combina el nuevo usuario con la listausuarios
      this.listaUsuarios.set([usuarioId, ...this.listaUsuarios()]);
      //limpiar el form
      this.nuevoUsuario = { name: '', email: '', password: '' };
    })
  }*/

    irAPerfil() {
    this.router.navigate(['/perfil']);
  }
}

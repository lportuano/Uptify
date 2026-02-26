import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicaService } from '../../services/musica-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './musica.html',
  styleUrl: './musica.css',
})
export class Musica implements OnInit {
  private musicaService = inject(MusicaService);

  listaMusica: any[] = [];
  reproductor = new Audio();
  cancionActual = signal<any>(null);

  mostrarAnuncio = signal<boolean>(false);
  cancionEnEspera: any = null;

  terminoBusqueda: string = '';
  cargando: boolean = false;

  ngOnInit() {
    this.reproductor.volume = 0;
    this.cargarMusicaInicial();
  }

  cargarMusicaInicial() {
    this.cargando = true;
    this.musicaService.obtenerCanciones().subscribe({
      next: (datos) => {
        this.listaMusica = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar las canciones:', err);
        this.cargando = false;
      }
    });
  }

  ejecutarBusqueda() {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarMusicaInicial();
      return;
    }
    this.cargando = true;
    this.musicaService.buscarMusica(this.terminoBusqueda).subscribe({
      next: (datos) => {
        this.listaMusica = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.cargando = false;
      }
    });
  }

  filtrarPorGenero(genero: string) {
    this.terminoBusqueda = genero;
    this.ejecutarBusqueda();
  }

  controlarMusica(cancion: any) {
    const userJson = localStorage.getItem('user');
    let planNombre = 'Gratuito';

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        planNombre = userData.plan?.nombre || 'Gratuito';
      } catch (e) {
        planNombre = 'Gratuito';
      }
    }

    if (planNombre === 'Gratuito' && this.reproductor.src !== cancion.preview) {
      this.cancionEnEspera = cancion;
      this.mostrarAnuncio.set(true); // Se activa el modal
      return;
    }

    this.ejecutarReproduccion(cancion);
  }

  saltarAnuncio() {
    const cancionParaReproducir = this.cancionEnEspera;
    this.mostrarAnuncio.set(false); // Cerramos modal
    this.cancionEnEspera = null;

    if (cancionParaReproducir) {
      this.ejecutarReproduccion(cancionParaReproducir); // ¡Aquí suena la música!
    }
  }

  ejecutarReproduccion(cancion: any) {
    if (this.reproductor.src === cancion.preview) {
      if (this.reproductor.paused) {
        this.reproductor.play();
      } else {
        this.reproductor.pause();
      }
      return;
    }

    this.reproductor.pause();
    this.reproductor.src = cancion.preview;
    this.reproductor.load();
    this.cancionActual.set(cancion);
    this.reproductor.play().catch(() => { });
  }
}
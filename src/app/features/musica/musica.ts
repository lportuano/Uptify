import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicaService } from '../../services/musica-service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './musica.html',
  styleUrl: './musica.css',
})
export class Musica implements OnInit {
  private musicaService = inject(MusicaService);
  private authService = inject(AuthService);

  listaMusica: any[] = [];
  reproductor = new Audio();
  cancionActual = signal<any>(null);

  mostrarAnuncio = signal<boolean>(false);
  cancionEnEspera: any = null;

  terminoBusqueda: string = '';
  cargando: boolean = false;

  ngOnInit() {
    this.reproductor.volume = 0.5;
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

  /**
   * LÓGICA DE CONTROL DE MÚSICA Y PLANES
   */
  controlarMusica(cancion: any) {
    // Obtenemos el plan desde el signal del AuthService (que ahora viene del Token)
    const planActual = this.authService.rolActual();
    
    console.log("Plan detectado en el componente:", planActual);

    /**
     * CONDICIÓN DE ANUNCIO:
     * El anuncio SOLO se muestra si el plan es explícitamente 'Gratuito' 
     * o si no se detecta ningún plan (por seguridad).
     * Si el plan es 'Premium' o 'Familiar', esta condición será falsa.
     */
    const esGratuito = !planActual || planActual === 'Gratuito';

    if (esGratuito && this.reproductor.src !== cancion.preview) {
      this.cancionEnEspera = cancion;
      this.mostrarAnuncio.set(true); // Se activa el modal de publicidad
      return;
    }

    // Si es Premium/Familiar, reproducimos de inmediato
    this.ejecutarReproduccion(cancion);
  }

  saltarAnuncio() {
    const cancionParaReproducir = this.cancionEnEspera;
    this.mostrarAnuncio.set(false);
    this.cancionEnEspera = null;

    if (cancionParaReproducir) {
      this.ejecutarReproduccion(cancionParaReproducir);
    }
  }

  ejecutarReproduccion(cancion: any) {
    // Si la canción ya está cargada, alternamos Play/Pause
    if (this.reproductor.src === cancion.preview) {
      if (this.reproductor.paused) {
        this.reproductor.play();
      } else {
        this.reproductor.pause();
      }
      return;
    }

    // Si es una canción nueva, la cargamos y reproducimos
    this.reproductor.pause();
    this.reproductor.src = cancion.preview;
    this.reproductor.load();
    this.cancionActual.set(cancion);
    this.reproductor.play().catch((err) => {
      console.warn("Error al intentar reproducir el audio:", err);
    });
  }
}
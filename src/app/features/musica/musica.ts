import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MusicaService } from '../../services/musica-service';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './musica.html',
  styleUrl: './musica.css',
})
export class Musica implements OnInit {
  private musicaService = inject(MusicaService);

  listaMusica: any[] = [];
  
  /** * OBJETO ESPEJO: 
   * Lo ponemos en volumen 0. No emite sonido, solo sirve para que 
   * las cards sepan qué canción está activa y si deben mostrar ▶ o ⏸.
   */
  reproductor = new Audio();

  cancionActual = signal<any>(null);
  terminoBusqueda: string = '';
  cargando: boolean = false;

  ngOnInit() {
    this.reproductor.volume = 0; // Silencio absoluto para evitar el eco
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
    // 1. Si es la misma canción que ya está en el sistema
    if (this.reproductor.src === cancion.preview) {
      if (this.reproductor.paused) {
        this.reproductor.play(); // Sincroniza icono a ⏸
      } else {
        this.reproductor.pause(); // Sincroniza icono a ▶
      }
      return; 
    }

    // 2. Si es una canción nueva:
    // Detenemos el objeto espejo anterior
    this.reproductor.pause();
    this.reproductor.src = cancion.preview;
    this.reproductor.load();

    // Activamos el reproductor visual del HTML mediante el Signal
    this.cancionActual.set(cancion);

    // Arrancamos el objeto espejo (en silencio) para que la card se ponga en modo "active"
    this.reproductor.play().catch(() => {});
  }
}
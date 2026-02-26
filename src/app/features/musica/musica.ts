import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el buscador (ngModel)
import { MusicaService } from '../../services/musica-service';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregamos FormsModule aquí
  templateUrl: './musica.html',
  styleUrl: './musica.css',
})
export class Musica implements OnInit {
  private musicaService = inject(MusicaService);

  listaMusica: any[] = [];
  reproductor = new Audio();

  // Variable para conectar con el input del HTML
  terminoBusqueda: string = '';
  // Variable para saber si está cargando (opcional para feedback visual)
  cargando: boolean = false;

  ngOnInit() {
    this.cargarMusicaInicial();
  }

  // Carga las 200 canciones por defecto
  cargarMusicaInicial() {
    this.cargando = true;
    this.musicaService.obtenerCanciones().subscribe({
      next: (datos) => {
        this.listaMusica = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el cargamento pesado', err);
        this.cargando = false;
      }
    });
  }

  // Función para buscar cuando el usuario presiona Enter o clic en la lupa
  ejecutarBusqueda() {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarMusicaInicial(); // Si borra todo, volvemos a los 200 originales
      return;
    }

    this.cargando = true;
    this.musicaService.buscarMusica(this.terminoBusqueda).subscribe({
      next: (datos) => {
        this.listaMusica = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda', err);
        this.cargando = false;
      }
    });
  }

  // Función para los botones de géneros rápidos
  filtrarPorGenero(genero: string) {
    this.terminoBusqueda = genero;
    this.ejecutarBusqueda();
  }

  controlarMusica(cancion: any) {
    // 1. Si el usuario hace clic en la misma canción que ya está sonando
    if (this.reproductor.src === cancion.preview) {
      if (this.reproductor.paused) {
        this.reproductor.play().catch(e => console.warn('Reproducción postergada:', e));
      } else {
        this.reproductor.pause();
      }
      return; // Salimos de la función aquí
    }

    // 2. Si es una canción nueva, primero reseteamos el reproductor
    this.reproductor.pause();
    this.reproductor.src = ''; // Limpiamos la fuente actual para evitar conflictos
    this.reproductor.load();   // Forzamos al navegador a olvidar la pista anterior

    // 3. Asignamos la nueva canción
    this.reproductor.src = cancion.preview;

    // 4. Esperamos a que el navegador esté listo antes de dar Play
    this.reproductor.oncanplaythrough = () => {
      this.reproductor.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error('Error real de audio:', e);
        }
      });
      // Limpiamos el evento para que no se acumule
      this.reproductor.oncanplaythrough = null;
    };
  }
}
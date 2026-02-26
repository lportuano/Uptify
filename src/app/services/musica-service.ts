import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicaService {
  private http = inject(HttpClient);

  obtenerCanciones() {

    const pedido1 = this.http.get<any>('https://itunes.apple.com/search?term=techno&limit=50&entity=song');
    const pedido2 = this.http.get<any>('https://itunes.apple.com/search?term=cyberpunk&limit=50&entity=song');
    const pedido3 = this.http.get<any>('https://itunes.apple.com/search?term=synthwave&limit=50&entity=song');
    const pedido4 = this.http.get<any>('https://itunes.apple.com/search?term=electro&limit=50&entity=song');

    return forkJoin([pedido1, pedido2, pedido3, pedido4]).pipe(
      map(respuestas => {

        const todas = [
          ...respuestas[0].results,
          ...respuestas[1].results,
          ...respuestas[2].results,
          ...respuestas[3].results
        ];
        

        return todas.map((pista: any) => ({
          titulo: pista.trackName,
          artista: pista.artistName,
          cover: pista.artworkUrl100.replace('100x100', '400x400'),
          preview: pista.previewUrl
        }));
      })
    );
  }


  buscarMusica(genero: string) {
    const url = `https://itunes.apple.com/search?term=${genero}&limit=50&entity=song`;
    return this.http.get<any>(url).pipe(
      map(res => res.results.map((pista: any) => ({
        titulo: pista.trackName,
        artista: pista.artistName,
        cover: pista.artworkUrl100.replace('100x100', '600x600'), // Máxima calidad
        preview: pista.previewUrl
      })))
    );
  }
}
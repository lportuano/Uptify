import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Plan {
  nombre: string;
  precio: string;
  caracteristicas: { texto: string; incluida: boolean }[];
  recomendado: boolean;
  textoBoton: string;
  ruta: string;
}

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planes.html',
  styleUrl: './planes.css',
})
export class Planes {
  @Input() listaPlanes: Plan[] = [
    {
      nombre: 'Gratis',
      precio: '5.99',
      recomendado: false,
      textoBoton: 'Empezar gratis',
      ruta: '/registro',  
      caracteristicas: [
        { texto: 'Música con anuncios', incluida: true },
        { texto: 'Solo modo aleatorio', incluida: true },
        { texto: 'Sin modo offline', incluida: false },
      ]
    },
    {
      nombre: 'Premium',
      precio: '9.99',
      recomendado: true,
      textoBoton: 'Prueba Premium',
      ruta: '/registro',
      caracteristicas: [
        { texto: 'Música sin anuncios', incluida: true },
        { texto: 'Escucha offline', incluida: true },
        { texto: 'Audio de alta fidelidad', incluida: true },
        { texto: 'Escucha en orden aleatorio', incluida: true },
      ]
    },
    {
      nombre: 'Familiar',
      precio: '14.99',
      recomendado: false,
      textoBoton: 'Obtener Familiar',
      ruta: '/registro',
      caracteristicas: [
        { texto: 'Hasta 6 cuentas Premium', incluida: true },
        { texto: 'Bloqueo de contenido explícito', incluida: true },
        { texto: 'Mix familiar', incluida: true },
      ]
    }
  ];
}
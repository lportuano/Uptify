import { Component } from '@angular/core';
import { Cartas } from "../../shared/cartas/cartas";
import { Genero } from "../../shared/genero/genero";
import { Online } from "../../shared/online/online";

@Component({
  selector: 'app-perfil',
  imports: [Cartas, Genero, Online],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {

}

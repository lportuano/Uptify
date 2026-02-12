import { Component } from '@angular/core';
import { Planes } from "../../shared/planes/planes";
import { TarjetaConocenos } from "../../shared/tarjeta-conocenos/tarjeta-conocenos";

@Component({
  selector: 'app-conocenos',
  imports: [Planes, TarjetaConocenos],
  templateUrl: './conocenos.html',
  styleUrl: './conocenos.css',
})
export class Conocenos {

}

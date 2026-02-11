import { Component } from '@angular/core';
import { Album } from "../../shared/album/album";
import { Planes } from "../../shared/planes/planes";
import { Carrucel } from "../../shared/carrucel/carrucel";

@Component({
  selector: 'app-home',
  imports: [Album, Planes, Carrucel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}

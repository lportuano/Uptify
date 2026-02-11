import { Component } from '@angular/core';
import { Album } from "../../shared/album/album";
import { Planes } from "../../shared/planes/planes";

@Component({
  selector: 'app-home',
  imports: [Album, Planes],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}

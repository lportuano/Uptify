import { Component } from '@angular/core';
import { Hero } from "../../shared/hero/hero";

@Component({
  selector: 'app-login',
  imports: [Hero],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}

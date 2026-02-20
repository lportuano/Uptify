import { Component } from '@angular/core';
import { Login } from "../../shared/login/login";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Login],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  
}
import { Component, inject } from '@angular/core';
import { Planes } from "../../shared/planes/planes";
import { TarjetaConocenos } from "../../shared/tarjeta-conocenos/tarjeta-conocenos";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-conocenos',
  imports: [Planes, TarjetaConocenos],
  templateUrl: './conocenos.html',
  styleUrl: './conocenos.css',
})
export class Conocenos {
  private router = inject(Router);
  private servicioAuth = inject(AuthService);

  planes() {
  if (this.servicioAuth.sesionIniciada()) {
    this.router.navigate(['/planes']);
  } else {
    this.router.navigate(['/conocenos/ver']);
  }
}
}
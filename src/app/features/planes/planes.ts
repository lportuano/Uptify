import { Component } from '@angular/core';
import { FormularioPlan } from '../../shared/formulario-plan/formulario-plan'; // Ruta al Paso 5

@Component({
  selector: 'app-planes-page',
  standalone: true,
  imports: [FormularioPlan], // Importamos el formulario con la lógica de PostgreSQL
  template: `
    <div class="planes-wrapper">
       <app-plan-form></app-plan-form> 
    </div>
  `
})
export class Planes { }
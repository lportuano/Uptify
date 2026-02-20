import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Registro } from './features/registro/registro';
import { LoginPage } from './features/login/login';
import { Conocenos } from './features/conocenos/conocenos';
import { Error } from './shared/error/error';
import { Perfil } from './features/perfil/perfil';
import { Planes } from './features/planes/planes';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },

    { path: 'conocenos', component: Conocenos },
    { path: 'registro', component: Registro },
    { path: 'login', component: LoginPage } ,// Usa el nuevo nombre de la clase
    { path: 'error', component: Error },
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
    { path: 'planes', component: Planes },
    
];

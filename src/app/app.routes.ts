import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Registro } from './features/registro/registro';
import { Login } from './features/login/login';
import { Conocenos } from './features/conocenos/conocenos';
import { Error } from './shared/error/error';

export const routes: Routes = [
    { path: '', component: Home },

    { path: 'conocenos', component: Conocenos },
    { path: 'registro', component: Registro },
    { path: 'login', component: Login },
    { path: 'error', component: Error },
];

import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Registro } from './features/registro/registro';
import { LoginPage } from './features/login/login';
import { Conocenos } from './features/conocenos/conocenos';
import { Error } from './shared/error/error';
import { Perfil } from './features/perfil/perfil';
import { Planes } from './features/planes/planes';
import { authGuard } from './guard/auth-guard';
import { childGuardGuard } from './guard/child-guard-guard';
import { authMatchGuard } from './guard/match-guard';

export const routes: Routes = [
    { path: '', component: Home },

    { path: 'conocenos', component: Conocenos, canActivateChild:[childGuardGuard], children:[
        { path: 'ver', component: Planes } ,
    ]},
    { path: 'registro', component: Registro },
    { path: 'login', component: LoginPage } ,
    { path: 'error', component: Error, canActivate: [authGuard] },
    { path: 'perfil', component: Perfil, canMatch: [authMatchGuard] },
    
    { path: '', canActivateChild: [childGuardGuard], children: [
        { path: 'planes', component: Planes },
    ]
},  
];

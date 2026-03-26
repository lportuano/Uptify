import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Registro } from './features/registro/registro';
import { LoginPage } from './features/login/login';
import { Conocenos } from './features/conocenos/conocenos';

import { Perfil } from './features/perfil/perfil';
import { Planes } from './features/planes/planes'; // Componente que carga el FormularioPlan
import { Musica } from './features/musica/musica';

// Guards
import { authGuard } from './guard/auth-guard';
import { childGuardGuard } from './guard/child-guard-guard';
import { authMatchGuard } from './guard/match-guard';
import { ReporteError } from './features/reporte-error/reporte-error';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS ---
    { path: '', component: Home },
    { path: 'registro', component: Registro },
    { path: 'login', component: LoginPage },

    {
        path: 'reportar',
        component: ReporteError,
        canMatch: [authMatchGuard]
    },

    // --- RUTAS PROTEGIDAS POR ROL (ADMIN) ---
    {
        path: 'admin-usuarios',
        component: Registro,
        canMatch: [authMatchGuard],
        data: { role: 'ROLE_ADMIN' }
    },

    // --- RUTAS PROTEGIDAS POR SESIÓN ---
    {
        path: 'musica',
        component: Musica,
        canMatch: [authMatchGuard]
    },

    {
        path: 'perfil',
        component: Perfil,
        canMatch: [authMatchGuard]
    },

    // --- RUTA DE PLANES  ---
    {
        path: 'planes',
        component: Planes , canMatch: [authMatchGuard]

    },

    // --- RUTAS CON HIJOS ---
    {
        path: 'conocenos',
        component: Conocenos,
        canActivateChild: [childGuardGuard],
        children: [
            { path: 'ver', component: Planes }, 
        ]
    },


];
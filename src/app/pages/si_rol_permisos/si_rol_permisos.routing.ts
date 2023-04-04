import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_rol_permisosComponent } from './si_rol_permisos.component';
import {Si_rol_permisosTableComponent } from './components/si_rol_permisos-table/si_rol_permisos-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_rol_permisosComponent,
    children: [
      { path: 'si_rol_permisos-table', component: Si_rol_permisosTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

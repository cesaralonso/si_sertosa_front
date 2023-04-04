import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_permisosComponent } from './si_permisos.component';
import {Si_permisosTableComponent } from './components/si_permisos-table/si_permisos-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_permisosComponent,
    children: [
      { path: 'si_permisos-table', component: Si_permisosTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

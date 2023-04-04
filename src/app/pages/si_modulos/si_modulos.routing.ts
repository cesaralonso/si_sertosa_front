import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_modulosComponent } from './si_modulos.component';
import {Si_modulosTableComponent } from './components/si_modulos-table/si_modulos-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_modulosComponent,
    children: [
      { path: 'si_modulos-table', component: Si_modulosTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

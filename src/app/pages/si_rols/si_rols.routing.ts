import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_rolsComponent } from './si_rols.component';
import {Si_rolsTableComponent } from './components/si_rols-table/si_rols-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_rolsComponent,
    children: [
      { path: 'si_rols-table', component: Si_rolsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

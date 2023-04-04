import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_user_rolsComponent } from './si_user_rols.component';
import {Si_user_rolsTableComponent } from './components/si_user_rols-table/si_user_rols-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_user_rolsComponent,
    children: [
      { path: 'si_user_rols-table', component: Si_user_rolsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_alertasComponent } from './si_alertas.component';
import {Si_alertasTableComponent } from './components/si_alertas-table/si_alertas-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_alertasComponent,
    children: [
      { path: 'si_alertas-table', component: Si_alertasTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_sesionsComponent } from './si_sesions.component';
import {Si_sesionsTableComponent } from './components/si_sesions-table/si_sesions-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_sesionsComponent,
    children: [
      { path: 'si_sesions-table', component: Si_sesionsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

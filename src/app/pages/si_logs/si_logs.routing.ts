import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_logsComponent } from './si_logs.component';
import {Si_logsTableComponent } from './components/si_logs-table/si_logs-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_logsComponent,
    children: [
      { path: 'si_logs-table', component: Si_logsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

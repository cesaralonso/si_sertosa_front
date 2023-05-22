import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Service_employeeestadosComponent } from './service_employeeestados.component';
import {Service_employeeestadosTableComponent } from './components/service_employeeestados-table/service_employeeestados-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Service_employeeestadosComponent,
    children: [
      { path: 'service_employeeestados-table', component: Service_employeeestadosTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

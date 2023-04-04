import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Service_employeesComponent } from './service_employees.component';
import {Service_employeesTableComponent } from './components/service_employees-table/service_employees-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Service_employeesComponent,
    children: [
      { path: 'service_employees-table', component: Service_employeesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

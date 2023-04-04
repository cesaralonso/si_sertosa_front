import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {EmployeesComponent } from './employees.component';
import {EmployeesTableComponent } from './components/employees-table/employees-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      { path: 'employees-table', component: EmployeesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

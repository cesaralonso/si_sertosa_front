import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Project_servicesComponent } from './project_services.component';
import {Project_servicesTableComponent } from './components/project_services-table/project_services-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Project_servicesComponent,
    children: [
      { path: 'project_services-table', component: Project_servicesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

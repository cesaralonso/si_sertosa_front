import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ProjectsComponent } from './projects.component';
import {ProjectsTableComponent } from './components/projects-table/projects-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      { path: 'projects-table', component: ProjectsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

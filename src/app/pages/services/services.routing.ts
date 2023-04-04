import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ServicesComponent } from './services.component';
import {ServicesTableComponent } from './components/services-table/services-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      { path: 'services-table', component: ServicesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ValidationsComponent } from './validations.component';
import {ValidationsTableComponent } from './components/validations-table/validations-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ValidationsComponent,
    children: [
      { path: 'validations-table', component: ValidationsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

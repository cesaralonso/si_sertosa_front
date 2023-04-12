import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ReportsComponent } from './reports.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

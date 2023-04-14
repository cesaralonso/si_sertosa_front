import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ReportsComponent } from './reports.component';
import { report } from 'process';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'reports', component: ReportsComponent
     }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

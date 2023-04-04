import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {FamilysComponent } from './familys.component';
import {FamilysTableComponent } from './components/familys-table/familys-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: FamilysComponent,
    children: [
      { path: 'familys-table', component: FamilysTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

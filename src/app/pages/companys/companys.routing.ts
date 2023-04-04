import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {CompanysComponent } from './companys.component';
import {CompanysTableComponent } from './components/companys-table/companys-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: CompanysComponent,
    children: [
      { path: 'companys-table', component: CompanysTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

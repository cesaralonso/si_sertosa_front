import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {CompanyunitssComponent } from './companyunitss.component';
import {CompanyunitssTableComponent } from './components/companyunitss-table/companyunitss-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: CompanyunitssComponent,
    children: [
      { path: 'companyunitss-table', component: CompanyunitssTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

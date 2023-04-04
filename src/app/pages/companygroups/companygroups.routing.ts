import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {CompanygroupsComponent } from './companygroups.component';
import {CompanygroupsTableComponent } from './components/companygroups-table/companygroups-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: CompanygroupsComponent,
    children: [
      { path: 'companygroups-table', component: CompanygroupsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

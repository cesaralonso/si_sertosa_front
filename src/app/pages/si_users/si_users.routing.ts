import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_usersComponent } from './si_users.component';
import {Si_usersTableComponent } from './components/si_users-table/si_users-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_usersComponent,
    children: [
      { path: 'si_users-table', component: Si_usersTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

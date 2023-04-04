import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ProvidersComponent } from './providers.component';
import {ProvidersTableComponent } from './components/providers-table/providers-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ProvidersComponent,
    children: [
      { path: 'providers-table', component: ProvidersTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

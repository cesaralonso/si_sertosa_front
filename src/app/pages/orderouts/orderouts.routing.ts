import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {OrderoutsComponent } from './orderouts.component';
import {OrderoutsTableComponent } from './components/orderouts-table/orderouts-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: OrderoutsComponent,
    children: [
      { path: 'orderouts-table', component: OrderoutsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

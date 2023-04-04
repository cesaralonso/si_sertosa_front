import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {OrderinsComponent } from './orderins.component';
import {OrderinsTableComponent } from './components/orderins-table/orderins-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: OrderinsComponent,
    children: [
      { path: 'orderins-table', component: OrderinsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

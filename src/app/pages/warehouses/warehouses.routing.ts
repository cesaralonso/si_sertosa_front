import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {WarehousesComponent } from './warehouses.component';
import {WarehousesTableComponent } from './components/warehouses-table/warehouses-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
    children: [
      { path: 'warehouses-table', component: WarehousesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {VehiclesComponent } from './vehicles.component';
import {VehiclesTableComponent } from './components/vehicles-table/vehicles-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent,
    children: [
      { path: 'vehicles-table', component: VehiclesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

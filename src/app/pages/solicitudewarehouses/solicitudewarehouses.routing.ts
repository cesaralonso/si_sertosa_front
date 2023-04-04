import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {SolicitudewarehousesComponent } from './solicitudewarehouses.component';
import {SolicitudewarehousesTableComponent } from './components/solicitudewarehouses-table/solicitudewarehouses-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: SolicitudewarehousesComponent,
    children: [
      { path: 'solicitudewarehouses-table', component: SolicitudewarehousesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

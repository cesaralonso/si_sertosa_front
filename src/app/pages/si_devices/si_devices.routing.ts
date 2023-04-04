import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Si_devicesComponent } from './si_devices.component';
import {Si_devicesTableComponent } from './components/si_devices-table/si_devices-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Si_devicesComponent,
    children: [
      { path: 'si_devices-table', component: Si_devicesTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

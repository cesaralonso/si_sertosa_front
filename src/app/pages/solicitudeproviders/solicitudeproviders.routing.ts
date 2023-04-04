import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {SolicitudeprovidersComponent } from './solicitudeproviders.component';
import {SolicitudeprovidersTableComponent } from './components/solicitudeproviders-table/solicitudeproviders-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: SolicitudeprovidersComponent,
    children: [
      { path: 'solicitudeproviders-table', component: SolicitudeprovidersTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

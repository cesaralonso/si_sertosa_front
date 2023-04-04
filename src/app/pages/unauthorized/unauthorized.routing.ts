import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {UnauthorizedComponent } from './unauthorized.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: UnauthorizedComponent
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

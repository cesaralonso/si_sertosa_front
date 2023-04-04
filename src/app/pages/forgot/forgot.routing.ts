import { Routes, RouterModule }  from '@angular/router';

import { Forgot } from './forgot.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Forgot
  }
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

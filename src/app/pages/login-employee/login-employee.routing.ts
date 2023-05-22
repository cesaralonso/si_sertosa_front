import { Routes, RouterModule } from '@angular/router';

import { LoginEmployeeComponent } from './login-employee.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: LoginEmployeeComponent
  }
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

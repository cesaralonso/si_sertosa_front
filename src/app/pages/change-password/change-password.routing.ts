import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent,
  }
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

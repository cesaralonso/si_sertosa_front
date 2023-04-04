import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' });

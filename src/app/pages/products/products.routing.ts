import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ProductsComponent } from './products.component';
import {ProductsTableComponent } from './components/products-table/products-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: 'products-table', component: ProductsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

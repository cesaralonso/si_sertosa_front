import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Service_productsComponent } from './service_products.component';
import {Service_productsTableComponent } from './components/service_products-table/service_products-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Service_productsComponent,
    children: [
      { path: 'service_products-table', component: Service_productsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

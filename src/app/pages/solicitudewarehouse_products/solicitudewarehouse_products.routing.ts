import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Solicitudewarehouse_productsComponent } from './solicitudewarehouse_products.component';
import {Solicitudewarehouse_productsTableComponent } from './components/solicitudewarehouse_products-table/solicitudewarehouse_products-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Solicitudewarehouse_productsComponent,
    children: [
      { path: 'solicitudewarehouse_products-table', component: Solicitudewarehouse_productsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

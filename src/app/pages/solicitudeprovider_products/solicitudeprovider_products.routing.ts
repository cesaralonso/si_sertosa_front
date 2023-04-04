import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {Solicitudeprovider_productsComponent } from './solicitudeprovider_products.component';
import {Solicitudeprovider_productsTableComponent } from './components/solicitudeprovider_products-table/solicitudeprovider_products-table.component';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Solicitudeprovider_productsComponent,
    children: [
      { path: 'solicitudeprovider_products-table', component: Solicitudeprovider_productsTableComponent }
    ]
    }
  ];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './service_products.routing';
import { Service_productsComponent } from './service_products.component';
import { Service_productsService } from './components/service_products-table/service_products.service';
import { Service_productsTableComponent } from './components/service_products-table/service_products-table.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    AppTranslationModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    MaterialModule,
  ],
  declarations: [
    Service_productsComponent,
    Service_productsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Service_productsService
  ]
})
export class Service_productsModule {
}

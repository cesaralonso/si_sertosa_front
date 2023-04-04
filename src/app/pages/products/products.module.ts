import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './products.routing';
import { ProductsComponent } from './products.component';
import { ProductsService } from './components/products-table/products.service';
import { ProductsTableComponent } from './components/products-table/products-table.component';
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
    ProductsComponent,
    ProductsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    ProductsService
  ]
})
export class ProductsModule {
}

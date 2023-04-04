import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './solicitudeprovider_products.routing';
import { Solicitudeprovider_productsComponent } from './solicitudeprovider_products.component';
import { Solicitudeprovider_productsService } from './components/solicitudeprovider_products-table/solicitudeprovider_products.service';
import { Solicitudeprovider_productsTableComponent } from './components/solicitudeprovider_products-table/solicitudeprovider_products-table.component';
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
    Solicitudeprovider_productsComponent,
    Solicitudeprovider_productsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Solicitudeprovider_productsService
  ]
})
export class Solicitudeprovider_productsModule {
}

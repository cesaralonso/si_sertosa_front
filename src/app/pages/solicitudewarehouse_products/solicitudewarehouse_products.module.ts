import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './solicitudewarehouse_products.routing';
import { Solicitudewarehouse_productsComponent } from './solicitudewarehouse_products.component';
import { Solicitudewarehouse_productsService } from './components/solicitudewarehouse_products-table/solicitudewarehouse_products.service';
import { Solicitudewarehouse_productsTableComponent } from './components/solicitudewarehouse_products-table/solicitudewarehouse_products-table.component';
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
    Solicitudewarehouse_productsComponent,
    Solicitudewarehouse_productsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Solicitudewarehouse_productsService
  ]
})
export class Solicitudewarehouse_productsModule {
}

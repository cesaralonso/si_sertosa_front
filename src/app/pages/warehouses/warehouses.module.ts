import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './warehouses.routing';
import { WarehousesComponent } from './warehouses.component';
import { WarehousesService } from './components/warehouses-table/warehouses.service';
import { WarehousesTableComponent } from './components/warehouses-table/warehouses-table.component';
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
    WarehousesComponent,
    WarehousesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    WarehousesService
  ]
})
export class WarehousesModule {
}

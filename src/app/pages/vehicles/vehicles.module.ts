import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './vehicles.routing';
import { VehiclesComponent } from './vehicles.component';
import { VehiclesService } from './components/vehicles-table/vehicles.service';
import { VehiclesTableComponent } from './components/vehicles-table/vehicles-table.component';
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
    VehiclesComponent,
    VehiclesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    VehiclesService
  ]
})
export class VehiclesModule {
}

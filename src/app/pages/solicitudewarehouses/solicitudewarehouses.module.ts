import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './solicitudewarehouses.routing';
import { SolicitudewarehousesComponent } from './solicitudewarehouses.component';
import { SolicitudewarehousesService } from './components/solicitudewarehouses-table/solicitudewarehouses.service';
import { SolicitudewarehousesTableComponent } from './components/solicitudewarehouses-table/solicitudewarehouses-table.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    AppTranslationModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    SolicitudewarehousesComponent,
    SolicitudewarehousesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    SolicitudewarehousesService
  ]
})
export class SolicitudewarehousesModule {
}

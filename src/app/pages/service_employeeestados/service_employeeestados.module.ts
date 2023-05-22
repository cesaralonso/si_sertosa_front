import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './service_employeeestados.routing';
import { Service_employeeestadosComponent } from './service_employeeestados.component';
import { Service_employeeestadosService } from './components/service_employeeestados-table/service_employeeestados.service';
import { Service_employeeestadosTableComponent } from './components/service_employeeestados-table/service_employeeestados-table.component';
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
    Service_employeeestadosComponent,
    Service_employeeestadosTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Service_employeeestadosService
  ]
})
export class Service_employeeestadosModule {
}

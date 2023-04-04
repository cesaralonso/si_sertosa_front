import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './service_employees.routing';
import { Service_employeesComponent } from './service_employees.component';
import { Service_employeesService } from './components/service_employees-table/service_employees.service';
import { Service_employeesTableComponent } from './components/service_employees-table/service_employees-table.component';
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
    Service_employeesComponent,
    Service_employeesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Service_employeesService
  ]
})
export class Service_employeesModule {
}

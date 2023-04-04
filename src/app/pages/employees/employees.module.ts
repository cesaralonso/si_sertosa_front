import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './employees.routing';
import { EmployeesComponent } from './employees.component';
import { EmployeesService } from './components/employees-table/employees.service';
import { EmployeesTableComponent } from './components/employees-table/employees-table.component';
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
    EmployeesComponent,
    EmployeesTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    EmployeesService
  ]
})
export class EmployeesModule {
}

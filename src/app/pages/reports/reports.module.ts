import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './reports.routing';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from '../../shared/material.module';
import { Report1TableComponent } from './components/report1-table/report1-table.component';
import { Report2TableComponent } from './components/report2-table/report2-table.component';

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
    ReportsComponent,
    Report1TableComponent,
    Report2TableComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ReportsModule {
}

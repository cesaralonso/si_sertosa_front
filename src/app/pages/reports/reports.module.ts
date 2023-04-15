import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './reports.routing';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from '../../shared/material.module';
import { Report4TableComponent } from './components/report4-table/report4-table.component'

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
    Report4TableComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ReportsModule {
}

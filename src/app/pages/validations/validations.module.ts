import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './validations.routing';
import { ValidationsComponent } from './validations.component';
import { ValidationsService } from './components/validations-table/validations.service';
import { ValidationsTableComponent } from './components/validations-table/validations-table.component';
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
    ValidationsComponent,
    ValidationsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    ValidationsService
  ]
})
export class ValidationsModule {
}

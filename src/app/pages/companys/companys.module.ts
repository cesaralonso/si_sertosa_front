import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './companys.routing';
import { CompanysComponent } from './companys.component';
import { CompanysService } from './components/companys-table/companys.service';
import { CompanysTableComponent } from './components/companys-table/companys-table.component';
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
    CompanysComponent,
    CompanysTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    CompanysService
  ]
})
export class CompanysModule {
}

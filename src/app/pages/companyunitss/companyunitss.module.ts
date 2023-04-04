import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './companyunitss.routing';
import { CompanyunitssComponent } from './companyunitss.component';
import { CompanyunitssService } from './components/companyunitss-table/companyunitss.service';
import { CompanyunitssTableComponent } from './components/companyunitss-table/companyunitss-table.component';
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
    CompanyunitssComponent,
    CompanyunitssTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    CompanyunitssService
  ]
})
export class CompanyunitssModule {
}

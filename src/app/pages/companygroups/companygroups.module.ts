import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './companygroups.routing';
import { CompanygroupsComponent } from './companygroups.component';
import { CompanygroupsService } from './components/companygroups-table/companygroups.service';
import { CompanygroupsTableComponent } from './components/companygroups-table/companygroups-table.component';
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
    CompanygroupsComponent,
    CompanygroupsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    CompanygroupsService
  ]
})
export class CompanygroupsModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_logs.routing';
import { Si_logsComponent } from './si_logs.component';
import { Si_logsService } from './components/si_logs-table/si_logs.service';
import { Si_logsTableComponent } from './components/si_logs-table/si_logs-table.component';
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
    Si_logsComponent,
    Si_logsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_logsService
  ]
})
export class Si_logsModule {
}

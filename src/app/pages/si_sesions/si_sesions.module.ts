import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_sesions.routing';
import { Si_sesionsComponent } from './si_sesions.component';
import { Si_sesionsService } from './components/si_sesions-table/si_sesions.service';
import { Si_sesionsTableComponent } from './components/si_sesions-table/si_sesions-table.component';
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
    Si_sesionsComponent,
    Si_sesionsTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_sesionsService
  ]
})
export class Si_sesionsModule {
}

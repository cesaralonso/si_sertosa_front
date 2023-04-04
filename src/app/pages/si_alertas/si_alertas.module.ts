import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './si_alertas.routing';
import { Si_alertasComponent } from './si_alertas.component';
import { Si_alertasService } from './components/si_alertas-table/si_alertas.service';
import { Si_alertasTableComponent } from './components/si_alertas-table/si_alertas-table.component';
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
    Si_alertasComponent,
    Si_alertasTableComponent,
  ],
  entryComponents: [
  ],
  providers: [
    Si_alertasService
  ]
})
export class Si_alertasModule {
}
